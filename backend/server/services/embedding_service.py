from typing import List, Optional, Dict
import math
import re
import hashlib

# Try to import sentence-transformers, fall back to lightweight TF-IDF if unavailable
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    HAVE_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAVE_SENTENCE_TRANSFORMERS = False
    print("WARNING: sentence-transformers not available, using lightweight TF-IDF fallback")

class EmbeddingService:
    def __init__(self):
        self.embedding_dim = 384
        self._model = None
        
        if HAVE_SENTENCE_TRANSFORMERS:
            self.model_name = "all-MiniLM-L6-v2"
        else:
            self.model_name = "lightweight-tfidf-fallback"
        
    @property
    def model(self):
        if not HAVE_SENTENCE_TRANSFORMERS:
            return None
        if self._model is None:
            print(f"Loading embedding model: {self.model_name}...")
            self._model = SentenceTransformer(self.model_name)
            print("Model loaded.")
        return self._model
    
    def generate_embedding(self, text: str) -> List[float]:
        if not text or not text.strip():
            return [0.0] * self.embedding_dim
        
        if HAVE_SENTENCE_TRANSFORMERS and self.model:
            try:
                embedding = self.model.encode(text)
                return embedding.tolist()
            except Exception as e:
                print(f"Error generating embedding with model: {e}")
        
        # TF-IDF fallback (works without PyTorch)
        return self._generate_tfidf_embedding(text)
    
    def _generate_tfidf_embedding(self, text: str) -> List[float]:
        """Lightweight TF-IDF based embedding fallback"""
        tokens = self._tokenize(text)
        if not tokens:
            return [0.0] * self.embedding_dim
        
        tf = self._compute_tf(tokens)
        
        embedding = [0.0] * self.embedding_dim
        for token, freq in tf.items():
            token_hash = int(hashlib.md5(token.encode()).hexdigest(), 16)
            for i in range(min(32, self.embedding_dim)):
                idx = (token_hash + i) % self.embedding_dim
                sign = 1 if ((token_hash >> i) & 1) == 0 else -1
                embedding[idx] += freq * sign * 0.1
        
        return self._normalize(embedding)
    
    def _tokenize(self, text: str) -> List[str]:
        text = text.lower()
        text = re.sub(r'[^\w\s]', ' ', text)
        tokens = text.split()
        return [t for t in tokens if len(t) > 2]
    
    def _compute_tf(self, tokens: List[str]) -> dict:
        tf = {}
        for token in tokens:
            tf[token] = tf.get(token, 0) + 1
        max_freq = max(tf.values()) if tf else 1
        return {k: v / max_freq for k, v in tf.items()}
    
    def _normalize(self, vec: List[float]) -> List[float]:
        norm = math.sqrt(sum(x * x for x in vec))
        if norm == 0:
            return vec
        return [x / norm for x in vec]
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        if not vec1 or not vec2:
            return 0.0
        
        dot = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot / (norm1 * norm2)
    
    def extract_tags(self, text: str) -> List[str]:
        hashtags = re.findall(r'#(\w+)', text)
        
        words = re.findall(r'\b[A-Za-z][a-z]{4,}\b', text)
        keywords = [w.lower() for w in words if w.lower() not in ["about", "their", "there", "would", "could"]]
        
        counts = {}
        for k in keywords:
            counts[k] = counts.get(k, 0) + 1
            
        top_keywords = sorted(counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        tags = list(set(hashtags + [k[0] for k in top_keywords]))
        return tags[:10]
    
    def compute_virality_score(self, text: str, engagement: Optional[dict] = None) -> float:
        base_score = 0.0
        
        if engagement:
            likes = engagement.get("likes", 0)
            retweets = engagement.get("retweets", 0)
            replies = engagement.get("replies", 0)
            base_score = min(100, (likes * 0.1 + retweets * 0.5 + replies * 0.3))
        
        viral_patterns = ["breaking", "thread", "🧵", "unpopular opinion", "hot take", "consciousness", "ai", "future"]
        for pattern in viral_patterns:
            if pattern.lower() in text.lower():
                base_score += 5
        
        if len(text) > 100 and len(text) < 280:
            base_score += 3
        
        return min(100, max(0, base_score))


embedding_service = EmbeddingService()
