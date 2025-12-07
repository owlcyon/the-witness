from fastapi import APIRouter

from app.api.v1.endpoints import login, graph, health, websockets

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(graph.router, prefix="/graph", tags=["graph"])
api_router.include_router(websockets.router, tags=["websockets"])
