from fastapi import WebSocket, WebSocketDisconnect
from typing import Set, Dict, Callable
import asyncio
import json

from server.services.graph_service import graph_service
from server.services.meme_processor import meme_processor
from server.services.system_monitor import system_monitor


class ConnectionManager:
    def __init__(self):
        self.stream_connections: Set[WebSocket] = set()
        self.loom_connections: Set[WebSocket] = set()
        self.stream_callbacks: Dict[WebSocket, Callable] = {}
    
    async def connect_stream(self, websocket: WebSocket):
        await websocket.accept()
        self.stream_connections.add(websocket)
        
        async def broadcast_callback(meme_event: Dict):
            if websocket in self.stream_connections:
                try:
                    await websocket.send_json({
                        "type": "meme",
                        "data": meme_event
                    })
                except Exception:
                    pass
        
        self.stream_callbacks[websocket] = broadcast_callback
        meme_processor.subscribe(broadcast_callback)
        system_monitor.log("WS-STREAM", "INFO", f"Client connected. Total: {len(self.stream_connections)}")
    
    async def connect_loom(self, websocket: WebSocket):
        await websocket.accept()
        self.loom_connections.add(websocket)
        
        snapshot = graph_service.get_graph_snapshot()
        await websocket.send_json({
            "type": "snapshot",
            "data": snapshot
        })
        system_monitor.log("WS-LOOM", "INFO", f"Client connected. Total: {len(self.loom_connections)}")
    
    def disconnect_stream(self, websocket: WebSocket):
        self.stream_connections.discard(websocket)
        
        callback = self.stream_callbacks.pop(websocket, None)
        if callback:
            meme_processor.unsubscribe(callback)
        
        system_monitor.log("WS-STREAM", "INFO", f"Client disconnected. Total: {len(self.stream_connections)}")
    
    def disconnect_loom(self, websocket: WebSocket):
        self.loom_connections.discard(websocket)
        system_monitor.log("WS-LOOM", "INFO", f"Client disconnected. Total: {len(self.loom_connections)}")
    
    async def broadcast_to_stream(self, message: Dict):
        disconnected = set()
        for connection in self.stream_connections:
            try:
                await connection.send_json({
                    "type": "meme",
                    "data": message
                })
            except Exception:
                disconnected.add(connection)
        
        for conn in disconnected:
            self.disconnect_stream(conn)
    
    async def broadcast_to_loom(self, message: Dict):
        disconnected = set()
        for connection in self.loom_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.add(connection)
        
        for conn in disconnected:
            self.disconnect_loom(conn)
    
    async def broadcast_node_update(self, node: Dict):
        await self.broadcast_to_loom({
            "type": "node_update",
            "data": node
        })
    
    async def broadcast_edge_update(self, edge: Dict):
        await self.broadcast_to_loom({
            "type": "edge_update",
            "data": edge
        })


manager = ConnectionManager()


async def stream_endpoint(websocket: WebSocket):
    await manager.connect_stream(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect_stream(websocket)


async def loom_endpoint(websocket: WebSocket):
    await manager.connect_loom(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
                
                elif message.get("type") == "request_snapshot":
                    snapshot = graph_service.get_graph_snapshot()
                    await websocket.send_json({
                        "type": "snapshot",
                        "data": snapshot
                    })
                
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect_loom(websocket)


async def start_loom_broadcaster():
    while True:
        await asyncio.sleep(5)
        if manager.loom_connections:
            snapshot = graph_service.get_graph_snapshot()
            await manager.broadcast_to_loom({
                "type": "snapshot",
                "data": snapshot
            })
