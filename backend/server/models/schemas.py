from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


class MemeEventSchema(BaseModel):
    id: str
    source: Literal["X (Twitter)", "Reddit", "4chan", "Substack", "Web"]
    content: str
    timestamp: str
    virality: float = Field(ge=0, le=100)
    tags: List[str] = []
    embedding: Optional[List[float]] = None

    class Config:
        from_attributes = True


class LoomNodeSchema(BaseModel):
    id: str
    x: float = Field(ge=0, le=100)
    y: float = Field(ge=0, le=100)
    size: float = Field(ge=0.1, le=10)
    color: str
    pulse: bool = False
    metadata: dict = {}

    class Config:
        from_attributes = True


class LoomEdgeSchema(BaseModel):
    id: int
    source_id: str
    target_id: str
    weight: float = 1.0
    edge_type: str = "semantic"


class WorkerNodeSchema(BaseModel):
    id: str
    status: Literal["IDLE", "ACTIVE", "ERROR"]
    current_task: Optional[str] = None
    domain_shard: Optional[str] = None
    throughput: float = 0.0


class LogEntrySchema(BaseModel):
    id: str
    timestamp: str
    agent_name: str
    type: Literal["INFO", "WARN", "ACTION", "SUCCESS"]
    message: str


class CrawlSeedInput(BaseModel):
    url: str
    seed_type: Literal["keyword", "user", "hashtag", "thread"] = "keyword"
    priority: Literal["critical", "standard", "low"] = "standard"


class SystemStatusSchema(BaseModel):
    system: Literal["ONLINE", "OFFLINE", "DEGRADED"]
    cpu_load: float
    memory_usage: float
    gpu_active: bool
    uptime_seconds: int
    active_workers: int
    queue_depth: int
    memes_processed: int


class GraphSnapshotSchema(BaseModel):
    nodes: List[LoomNodeSchema]
    edges: List[LoomEdgeSchema]
    stats: dict = {}


class ConfigSchema(BaseModel):
    twitter_api_key: Optional[str] = None
    embedding_model: str = "all-MiniLM-L6-v2"
    similarity_threshold: float = 0.7
    crawl_interval_seconds: int = 300
    max_workers: int = 4
    autonomy_enabled: bool = False


class ConfigUpdateSchema(BaseModel):
    key: str
    value: dict
