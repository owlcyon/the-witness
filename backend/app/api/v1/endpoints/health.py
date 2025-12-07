from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import redis.asyncio as redis

from app.db.session import get_db
from app.core.config import settings

router = APIRouter()

@router.get("/live", status_code=200)
async def health_live() -> Dict[str, str]:
    """
    Liveness probe.
    Returns 200 if the service itself is running.
    Does NOT check dependencies.
    """
    return {"status": "ok"}

@router.get("/ready", status_code=200)
async def health_ready(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Readiness probe.
    Checks connections to Database and Redis.
    Returns 503 if any critical dependency is down.
    """
    status = {
        "database": "unknown",
        "redis": "unknown"
    }
    
    # Check Database
    try:
        await db.execute(text("SELECT 1"))
        status["database"] = "ok"
    except Exception as e:
        status["database"] = f"error: {str(e)}"
        
    # Check Redis
    try:
        r = redis.from_url(settings.REDIS_URL, socket_timeout=5)
        await r.ping()
        await r.close()
        status["redis"] = "ok"
    except Exception as e:
        status["redis"] = f"error: {str(e)}"
        
    if status["database"] != "ok" or status["redis"] != "ok":
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=status)
        
    return status
