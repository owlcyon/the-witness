import json
import asyncio
from typing import Dict, Any

import redis.asyncio as redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import log
from app.schemas.meme import MemeCreate
from app.services.graph_service import GraphService

class MemeProcessor:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.queue_name = "meme_queue"

    async def enqueue_meme(self, meme_in: MemeCreate):
        """Push meme to Redis queue for processing."""
        data = meme_in.model_dump_json()
        await self.redis.rpush(self.queue_name, data)
        log.info("Meme enqueued", content_preview=meme_in.content[:20])

    async def process_batch(self, db: AsyncSession, batch_size: int = 10):
        """Pop items from queue and process them."""
        # Note: In a real worker, this would run in a loop.
        # Here we process a batch.
        
        graph_service = GraphService(db)
        
        for _ in range(batch_size):
            # Non-blocking pop, or use blpop for blocking
            item = await self.redis.lpop(self.queue_name)
            if not item:
                break
                
            try:
                data = json.loads(item)
                meme_in = MemeCreate(**data)
                
                # Persist to Graph (generate embedding, save to DB)
                meme = await graph_service.add_node(meme_in)
                log.info("Meme processed", id=meme.id)
                
                # Todo: Add edge creation logic here (find neighbors, create edges)
                # neighbors = await graph_service.find_nearest_neighbors(meme.embedding, k=5)
                # for neighbor in neighbors:
                #    if neighbor.id != meme.id:
                #        await graph_service.add_edge(meme.id, neighbor.id, neighbor.similarity)

            except Exception as e:
                log.error("Error processing meme", error=str(e), item=item)
                # Dead letter queue logic would go here

# Dependency to get Redis client
async def get_redis() -> redis.Redis:
    return redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
