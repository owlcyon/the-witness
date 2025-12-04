from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from server.api.routes import router
from server.api.websockets import stream_endpoint, loom_endpoint, start_loom_broadcaster, manager
from server.services.system_monitor import system_monitor
from server.services.meme_processor import meme_processor
from server.services.graph_service import graph_service

app = FastAPI(
    title="The Witness API",
    description="Autonomous Distributed API for Eternal Threads - Mapping the Noosphere",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await stream_endpoint(websocket)


@app.websocket("/ws/loom")
async def websocket_loom(websocket: WebSocket):
    await loom_endpoint(websocket)


@app.on_event("startup")
async def startup_event():
    system_monitor.log("WITNESS-CORE", "SUCCESS", "The Witness API is now ONLINE")
    
    seed_content = [
        ("The intersection of AI consciousness and spiritual awakening creates new pathways for human evolution", "spiritual"),
        ("Machine learning models are beginning to exhibit emergent behaviors that mirror ancient wisdom traditions", "ai"),
        ("Meme culture has become the primary vector for transmitting complex philosophical ideas to new generations", "cultural"),
        ("The noosphere is increasingly being shaped by algorithmic curation and AI-generated content", "ai"),
        ("Digital spirituality movements are gaining traction as people seek meaning in technological landscapes", "spiritual"),
    ]
    
    for content, cluster in seed_content:
        await meme_processor.process_raw_content(
            content=content,
            source="Web",
            metadata={"cluster_hint": cluster}
        )
    
    system_monitor.log("SEED-LOADER", "SUCCESS", f"Loaded {len(seed_content)} initial seed nodes")
    
    asyncio.create_task(start_loom_broadcaster())
    system_monitor.log("LOOM-BROADCASTER", "INFO", "Loom broadcast loop started")


@app.get("/")
async def root():
    return {
        "name": "The Witness",
        "version": "0.1.0",
        "status": "ONLINE",
        "description": "Autonomous Distributed API for Eternal Threads",
        "endpoints": {
            "status": "/api/v1/status",
            "stream": "/api/v1/stream",
            "graph": "/api/v1/graph/nodes",
            "seeds": "/api/v1/seeds",
            "config": "/api/v1/config",
            "workers": "/api/v1/workers",
            "logs": "/api/v1/logs",
            "ingest": "/api/v1/ingest"
        },
        "websockets": {
            "meme_stream": "/ws/stream",
            "loom_topology": "/ws/loom"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
