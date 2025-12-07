from datetime import datetime
from typing import Optional, Any

from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.db.base import Base

class Meme(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)
    # 1536 dimensions for OpenAI text-embedding-ada-002, 
    # adjust if using a different model (e.g. SBERT is 384)
    # Using 384 for sentence-transformers "all-MiniLM-L6-v2" as a default open source choice
    embedding = Column(Vector(384)) 
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata_ = Column("metadata", JSON, default={})

    # Relationships
    edges_from = relationship("Edge", foreign_keys="Edge.source_id", back_populates="source")
    edges_to = relationship("Edge", foreign_keys="Edge.target_id", back_populates="target")
