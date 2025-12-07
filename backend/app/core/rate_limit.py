import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter

from app.core.config import settings

async def init_rate_limiter():
    redis_connection = redis.from_url(
        settings.REDIS_URL, encoding="utf8", decode_responses=True
    )
    await FastAPILimiter.init(redis_connection)
