from datetime import datetime

from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base

class Edge(Base):
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("meme.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("meme.id"), nullable=False)
    weight = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    source = relationship("Meme", foreign_keys=[source_id], back_populates="edges_from")
    target = relationship("Meme", foreign_keys=[target_id], back_populates="edges_to")
