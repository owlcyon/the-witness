from typing import Dict, List, Optional, Callable
from datetime import datetime
import uuid
import asyncio

from .embedding_service import embedding_service
from .graph_service import graph_service


class MemeProcessor:
    def __init__(self):
        self.processed_count = 0
        self.queue: List[Dict] = []
        self.subscribers = set()
    
    async def process_raw_content(self, content: str, source: str, metadata: Optional[dict] = None) -> Dict:
        meme_id = str(uuid.uuid4())[:8]
        
        # Offload heavy embedding generation to thread to avoid blocking event loop
        loop = asyncio.get_event_loop()
        embedding = await loop.run_in_executor(None, embedding_service.generate_embedding, content)
        
        tags = embedding_service.extract_tags(content)
        virality = embedding_service.compute_virality_score(content, metadata)
        
        # Use semantic clustering instead of just keywords
        cluster = await self._infer_cluster_semantic(content, embedding)
        
        meme_event = {
            "id": meme_id,
            "source": source,
            "content": content,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "virality": virality,
            "tags": tags,
            "embedding": embedding
        }
        
        graph_service.add_node(
            node_id=meme_id,
            label=content[:50] + "..." if len(content) > 50 else content,
            cluster=cluster,
            embedding=embedding
        )
        
        similar_nodes = graph_service.find_similar_nodes(meme_id, threshold=0.5)
        for similar_id in similar_nodes[:3]:
            source_emb = embedding
            target_emb = graph_service.graph.nodes[similar_id].get("embedding", [])
            weight = embedding_service.cosine_similarity(source_emb, target_emb)
            graph_service.add_edge(meme_id, similar_id, weight=weight)
        
        self.processed_count += 1
        
        await self._broadcast_meme(meme_event)
        
        return meme_event
    
    async def _infer_cluster_semantic(self, content: str, embedding: List[float]) -> str:
        # Define anchor texts for each cluster
        anchors = {
            "spiritual": "soul spirit consciousness awakening meditation divine sacred mystical enlightenment god non-duality",
            "ai": "artificial intelligence machine learning neural networks algorithm singularity automation llm gpt",
            "cultural": "meme viral trend culture society generation zeitgeist social media internet",
            "political": "politics government democracy policy election voting law rights"
        }
        
        best_cluster = "default"
        max_score = -1.0
        
        # We can cache these anchor embeddings, but for now generating them on fly (or lazy loading) is okay 
        # as this is per-item processing. Optimization: Cache anchor embeddings in __init__.
        
        loop = asyncio.get_event_loop()
        
        for cluster, anchor_text in anchors.items():
            # In a real app, cache these!
            anchor_emb = await loop.run_in_executor(None, embedding_service.generate_embedding, anchor_text)
            score = embedding_service.cosine_similarity(embedding, anchor_emb)
            
            if score > max_score:
                max_score = score
                best_cluster = cluster
        
        # Fallback to keyword matching if confidence is low
        if max_score < 0.2:
            return self._infer_cluster_keyword(content)
            
        return best_cluster

    def _infer_cluster_keyword(self, content: str) -> str:
        content_lower = content.lower()
        
        spiritual_keywords = ["soul", "spirit", "consciousness", "awakening", "meditation", "divine", "sacred", "mystical", "enlightenment"]
        ai_keywords = ["ai", "artificial intelligence", "machine learning", "gpt", "neural", "algorithm", "automation", "singularity"]
        cultural_keywords = ["meme", "viral", "trend", "culture", "society", "generation", "zeitgeist"]
        political_keywords = ["politics", "government", "election", "democracy", "policy", "vote"]
        
        scores = {
            "spiritual": sum(1 for k in spiritual_keywords if k in content_lower),
            "ai": sum(1 for k in ai_keywords if k in content_lower),
            "cultural": sum(1 for k in cultural_keywords if k in content_lower),
            "political": sum(1 for k in political_keywords if k in content_lower)
        }
        
        max_score = max(scores.values())
        if max_score > 0:
            for cluster, score in scores.items():
                if score == max_score:
                    return cluster
        
        return "default"
    
    async def _broadcast_meme(self, meme_event: Dict):
        for subscriber in list(self.subscribers):
            try:
                await subscriber(meme_event)
            except Exception:
                self.subscribers.discard(subscriber)
    
    def subscribe(self, callback):
        self.subscribers.add(callback)
    
    def unsubscribe(self, callback):
        self.subscribers.discard(callback)
    
    def get_stats(self) -> Dict:
        return {
            "processed_count": self.processed_count,
            "queue_depth": len(self.queue),
            "graph_nodes": graph_service.graph.number_of_nodes(),
            "graph_edges": graph_service.graph.number_of_edges()
        }


meme_processor = MemeProcessor()
