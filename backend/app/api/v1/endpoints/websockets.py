from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_service import manager

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection open and listen for messages (heartbeat/ping)
            data = await websocket.receive_text()
            # Echo back or process
            # await manager.broadcast(f"Client says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
