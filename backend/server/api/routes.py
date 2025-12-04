from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from typing import List, Optional
import asyncio
import json

from server.models.schemas import (
    MemeEventSchema, LoomNodeSchema, WorkerNodeSchema, LogEntrySchema,
    CrawlSeedInput, SystemStatusSchema, GraphSnapshotSchema, ConfigSchema
)
from server.services.graph_service import graph_service
from server.services.meme_processor import meme_processor
from server.services.system_monitor import system_monitor
from server.services.crawler_service import crawler_service

router = APIRouter(prefix="/api/v1")


@router.get("/status", response_model=SystemStatusSchema)
async def get_system_status():
    status = system_monitor.get_status()
    stats = meme_processor.get_stats()
    status["memes_processed"] = stats["processed_count"]
    status["queue_depth"] = stats["queue_depth"]
    return status


@router.get("/stream")
async def get_meme_stream(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    source: Optional[str] = None
):
    nodes = graph_service.get_all_nodes()
    
    events = []
    for node in nodes:
        graph_node = graph_service.graph.nodes.get(node["id"], {})
        events.append({
            "id": node["id"],
            "source": "Web",
            "content": graph_node.get("label", ""),
            "timestamp": "2024-01-01T00:00:00Z",
            "virality": node["size"] * 20,
            "tags": [node["metadata"].get("cluster", "default")]
        })
    
    start = (page - 1) * limit
    end = start + limit
    
    return {
        "events": events[start:end],
        "total": len(events),
        "page": page,
        "limit": limit,
        "has_more": end < len(events)
    }


@router.get("/graph/nodes")
async def get_graph_snapshot():
    snapshot = graph_service.get_graph_snapshot()
    return snapshot


@router.post("/seeds")
async def add_crawl_seed(seed: CrawlSeedInput):
    system_monitor.log("SEED-INJECTOR", "ACTION", f"New seed added: {seed.url}")
    
    # Trigger the crawler service
    job_id = await crawler_service.start_crawl(seed.url, seed.priority)
    
    return {
        "success": True,
        "seed_id": job_id,
        "message": f"Seed queued for crawling: {seed.url} (Job ID: {job_id})"
    }


@router.get("/config")
async def get_config():
    return {
        "embedding_model": "all-MiniLM-L6-v2",
        "similarity_threshold": 0.7,
        "crawl_interval_seconds": 300,
        "max_workers": 4,
        "autonomy_enabled": False
    }


@router.post("/config")
async def update_config(config: dict):
    system_monitor.log("CONFIG", "ACTION", f"Configuration updated: {list(config.keys())}")
    return {"success": True, "updated": list(config.keys())}


@router.get("/workers")
async def get_workers():
    return crawler_service.get_workers()


@router.get("/logs")
async def get_logs(limit: int = Query(50, ge=1, le=200)):
    return system_monitor.get_logs(limit)


@router.post("/ingest")
async def ingest_content(payload: dict):
    content = payload.get("content", "")
    source = payload.get("source", "Web")
    metadata = payload.get("metadata", {})
    
    if not content:
        raise HTTPException(status_code=400, detail="Content is required")
    
    meme = await meme_processor.process_raw_content(content, source, metadata)
    return meme
