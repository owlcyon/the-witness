from typing import List
from sentence_transformers import SentenceTransformer
from app.core.circuit_breaker import breaker

# Singleton for the model to avoid reloading
_model = None

class EmbeddingService:
    def __init__(self):
        global _model
        if _model is None:
            # Using a small, fast model for CPU inference
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        self.model = _model

    @breaker
    def generate_embedding(self, text: str) -> List[float]:
        return self.model.encode(text).tolist()

# Global instance for now, but in a real app might be dependency injected or external service
embedding_service = EmbeddingService()
