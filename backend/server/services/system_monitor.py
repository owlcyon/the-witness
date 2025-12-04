import time
import os
from typing import Dict, List, Optional
from datetime import datetime
import uuid

class SystemMonitor:
    def __init__(self):
        self.start_time = time.time()
        self.workers: Dict[str, Dict] = {}
        self.logs: List[Dict] = []
        self.max_logs = 1000
        
        for i in range(3):
            worker_id = f"worker-{i+1:02d}"
            self.workers[worker_id] = {
                "id": worker_id,
                "status": "IDLE",
                "current_task": None,
                "domain_shard": None,
                "throughput": 0.0,
                "last_heartbeat": datetime.utcnow()
            }
        
        self.log("WITNESS-CORE", "INFO", "System initialized")
    
    def get_status(self) -> Dict:
        uptime = int(time.time() - self.start_time)
        active_workers = sum(1 for w in self.workers.values() if w["status"] == "ACTIVE")
        
        try:
            load = os.getloadavg()[0] * 10
        except:
            load = 5.0
        
        return {
            "system": "ONLINE",
            "cpu_load": min(100, load),
            "memory_usage": 35.0,
            "gpu_active": False,
            "uptime_seconds": uptime,
            "active_workers": active_workers,
            "queue_depth": 0,
            "memes_processed": 0
        }
    
    def get_workers(self) -> List[Dict]:
        return [
            {
                "id": w["id"],
                "status": w["status"],
                "current_task": w["current_task"],
                "domain_shard": w["domain_shard"],
                "throughput": w["throughput"]
            }
            for w in self.workers.values()
        ]
    
    def update_worker(self, worker_id: str, status: Optional[str] = None, task: Optional[str] = None, shard: Optional[str] = None, throughput: Optional[float] = None):
        if worker_id in self.workers:
            if status:
                self.workers[worker_id]["status"] = status
            if task is not None:
                self.workers[worker_id]["current_task"] = task
            if shard is not None:
                self.workers[worker_id]["domain_shard"] = shard
            if throughput is not None:
                self.workers[worker_id]["throughput"] = throughput
            self.workers[worker_id]["last_heartbeat"] = datetime.utcnow()
    
    def log(self, agent_name: str, log_type: str, message: str) -> Dict:
        entry = {
            "id": str(uuid.uuid4())[:8],
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "agent_name": agent_name,
            "type": log_type,
            "message": message
        }
        
        self.logs.append(entry)
        if len(self.logs) > self.max_logs:
            self.logs = self.logs[-self.max_logs:]
        
        return entry
    
    def get_logs(self, limit: int = 50) -> List[Dict]:
        return self.logs[-limit:][::-1]


system_monitor = SystemMonitor()
