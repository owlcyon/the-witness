from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis

from app.api import deps
from app.schemas.meme import MemeCreate, MemeSearchResult, GraphStats
from app.services.graph_service import GraphService
from app.services.meme_processor import MemeProcessor, get_redis
from app.db.session import get_db

router = APIRouter()

@router.post("/ingest", status_code=202)
async def ingest_meme(
    meme_in: MemeCreate,
    redis_client: redis.Redis = Depends(get_redis),
    # current_user = Depends(deps.get_current_active_superuser) # Protect endpoint
) -> Any:
    """
    Ingest a meme for processing. Uses Redis queue.
    """
    processor = MemeProcessor(redis_client)
    await processor.enqueue_meme(meme_in)
    return {"status": "queued"}

@router.post("/process", status_code=200)
async def process_queue(
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis),
    # current_user = Depends(deps.get_current_active_superuser)
) -> Any:
    """
    Trigger manual processing of the queue (for dev/testing).
    In prod, this would be a separate worker process.
    """
    processor = MemeProcessor(redis_client)
    await processor.process_batch(db)
    return {"status": "batch processed"}

@router.get("/search", response_model=List[MemeSearchResult])
async def search_memes(
    query: str,
    k: int = 5,
    db: AsyncSession = Depends(get_db)
) -> Any:
    service = GraphService(db)
    # We need to generate embedding for query first
    # This logic belongs in service, but for now calling embedding service here or in service?
    # Service implementation expects embedding list.
    from app.services.embedding_service import embedding_service
    embedding = embedding_service.generate_embedding(query)
    
    return await service.find_nearest_neighbors(embedding, k)

@router.get("/stats", response_model=GraphStats)
async def get_graph_stats(
    db: AsyncSession = Depends(get_db)
) -> Any:
    service = GraphService(db)
    return await service.get_stats()
