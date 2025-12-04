import networkx as nx
from typing import List, Dict, Tuple, Optional
import random
import math

class GraphService:
    def __init__(self):
        self.graph = nx.Graph()
        self._node_positions = {}
    
    def add_node(self, node_id: str, label: str = "", cluster: str = "default", embedding: Optional[List[float]] = None):
        if not self.graph.has_node(node_id):
            x, y = self._compute_position(node_id, cluster)
            self.graph.add_node(
                node_id,
                label=label,
                cluster=cluster,
                embedding=embedding or [],
                x=x,
                y=y,
                size=1.0,
                pulse=True
            )
            self._node_positions[node_id] = (x, y)
        return self.get_node(node_id)
    
    def add_edge(self, source_id: str, target_id: str, weight: float = 1.0, edge_type: str = "semantic"):
        if self.graph.has_node(source_id) and self.graph.has_node(target_id):
            self.graph.add_edge(source_id, target_id, weight=weight, edge_type=edge_type)
            self._update_node_size(source_id)
            self._update_node_size(target_id)
    
    def _compute_position(self, node_id: str, cluster: str) -> Tuple[float, float]:
        cluster_centers = {
            "spiritual": (25, 25),
            "ai": (75, 25),
            "cultural": (25, 75),
            "political": (75, 75),
            "default": (50, 50)
        }
        center = cluster_centers.get(cluster, (50, 50))
        angle = random.uniform(0, 2 * math.pi)
        radius = random.uniform(5, 20)
        x = max(5, min(95, center[0] + radius * math.cos(angle)))
        y = max(5, min(95, center[1] + radius * math.sin(angle)))
        return x, y
    
    def _update_node_size(self, node_id: str):
        if self.graph.has_node(node_id):
            degree = self.graph.degree(node_id)
            size = 1.0 + (int(degree) * 0.3)
            self.graph.nodes[node_id]['size'] = min(size, 5.0)
    
    def get_node(self, node_id: str) -> Optional[Dict]:
        if self.graph.has_node(node_id):
            data = self.graph.nodes[node_id]
            return {
                "id": node_id,
                "x": data.get("x", 50),
                "y": data.get("y", 50),
                "size": data.get("size", 1.0),
                "color": self._cluster_to_color(data.get("cluster", "default")),
                "pulse": data.get("pulse", False),
                "metadata": {
                    "label": data.get("label", ""),
                    "cluster": data.get("cluster", "default")
                }
            }
        return None
    
    def _cluster_to_color(self, cluster: str) -> str:
        colors = {
            "spiritual": "#9945FF",
            "ai": "#00FF88",
            "cultural": "#FF6B35",
            "political": "#3B82F6",
            "default": "#8B5CF6"
        }
        return colors.get(cluster, "#8B5CF6")
    
    def get_all_nodes(self) -> List[Dict]:
        nodes = []
        for node_id in self.graph.nodes():
            node = self.get_node(node_id)
            if node:
                nodes.append(node)
        return nodes
    
    def get_all_edges(self) -> List[Dict]:
        edges = []
        for idx, (source, target, data) in enumerate(self.graph.edges(data=True)):
            edges.append({
                "id": idx,
                "source_id": source,
                "target_id": target,
                "weight": data.get("weight", 1.0),
                "edge_type": data.get("edge_type", "semantic")
            })
        return edges
    
    def get_graph_snapshot(self) -> Dict:
        nodes = self.get_all_nodes()
        edges = self.get_all_edges()
        
        stats = {
            "node_count": self.graph.number_of_nodes(),
            "edge_count": self.graph.number_of_edges(),
            "density": nx.density(self.graph) if self.graph.number_of_nodes() > 0 else 0,
            "clusters": self._count_clusters()
        }
        
        return {
            "nodes": nodes,
            "edges": edges,
            "stats": stats
        }
    
    def _count_clusters(self) -> Dict[str, int]:
        clusters = {}
        for node_id in self.graph.nodes():
            cluster = self.graph.nodes[node_id].get("cluster", "default")
            clusters[cluster] = clusters.get(cluster, 0) + 1
        return clusters
    
    def compute_centrality(self) -> Dict[str, float]:
        if self.graph.number_of_nodes() == 0:
            return {}
        try:
            return nx.degree_centrality(self.graph)
        except:
            return {}
    
    def find_similar_nodes(self, node_id: str, threshold: float = 0.7) -> List[str]:
        if not self.graph.has_node(node_id):
            return []
        
        source_embedding = self.graph.nodes[node_id].get("embedding", [])
        if not source_embedding:
            return []
        
        similar = []
        for other_id in self.graph.nodes():
            if other_id == node_id:
                continue
            other_embedding = self.graph.nodes[other_id].get("embedding", [])
            if other_embedding:
                similarity = self._cosine_similarity(source_embedding, other_embedding)
                if similarity >= threshold:
                    similar.append(other_id)
        
        return similar
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        if len(vec1) != len(vec2) or len(vec1) == 0:
            return 0.0
        
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)


graph_service = GraphService()
