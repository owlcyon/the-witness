from typing import List, Optional, Tuple

from pgvector.sqlalchemy import Vector
from sqlalchemy import func, select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.meme import Meme
from app.models.edge import Edge
from app.schemas.meme import MemeCreate, MemeSearchResult, GraphStats
from app.services.embedding_service import embedding_service

class GraphService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def add_node(self, meme_in: MemeCreate) -> Meme:
        # Generate embedding
        embedding = embedding_service.generate_embedding(meme_in.content)
        
        db_meme = Meme(
            content=meme_in.content,
            metadata_=meme_in.metadata,
            embedding=embedding
        )
        self.db.add(db_meme)
        await self.db.commit()
        await self.db.refresh(db_meme)
        return db_meme

    async def add_edge(self, source_id: int, target_id: int, weight: float) -> Edge:
        db_edge = Edge(source_id=source_id, target_id=target_id, weight=weight)
        self.db.add(db_edge)
        await self.db.commit()
        await self.db.refresh(db_edge)
        return db_edge

    async def find_nearest_neighbors(self, embedding: List[float], k: int = 5) -> List[MemeSearchResult]:
        # Uses pgvector's <=> operator for cosine distance (or L2, depending on index)
        # We order by distance ASC
        stmt = select(Meme).order_by(Meme.embedding.l2_distance(embedding)).limit(k)
        result = await self.db.execute(stmt)
        memes = result.scalars().all()
        
        # Calculate similarity (placeholder, pgvector returns items, not distance in simple select)
        # To get distance: select(Meme, Meme.embedding.l2_distance(embedding))...
        
        return [
            MemeSearchResult(
                **meme.__dict__, 
                similarity=0.0 # Todo: fetch actual distance
            ) for meme in memes
        ]

    async def get_stats(self) -> GraphStats:
        node_count = await self.db.scalar(select(func.count(Meme.id)))
        edge_count = await self.db.scalar(select(func.count(Edge.id)))
        
        density = 0.0
        if node_count > 1:
            possible_edges = node_count * (node_count - 1) / 2
            density = edge_count / possible_edges
            
        return GraphStats(node_count=node_count, edge_count=edge_count, density=density)
