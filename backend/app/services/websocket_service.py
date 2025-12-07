import json
from typing import List, Any
from fastapi import WebSocket
from app.core.logging import log

class ConnectionManager:
    def __init__(self):
        # In-memory list of connections
        # For horizontal scaling, this needs to be coupled with Redis Pub/Sub
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        log.info(f"WebSocket connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            log.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                log.error("Error broadcasting message", error=str(e))
                # Cleanup dead connections lazily
                self.disconnect(connection)

    async def broadcast_json(self, data: Any):
        await self.broadcast(json.dumps(data, default=str))

    async def broadcast_delta(self, action: str, node_id: int, data: Any):
        """
        Broadcast a small change (delta) rather than the full graph.
        action: 'add', 'update', 'delete'
        """
        payload = {
            "type": "delta",
            "action": action,
            "node_id": node_id,
            "data": data
        }
        await self.broadcast_json(payload)

manager = ConnectionManager()
