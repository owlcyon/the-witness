from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict

# Shared properties
class MemeBase(BaseModel):
    content: str
    metadata: Dict[str, Any] = {}

class MemeCreate(MemeBase):
    pass

class MemeInDBBase(MemeBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Meme(MemeInDBBase):
    pass

class MemeSearchResult(Meme):
    similarity: float

class GraphStats(BaseModel):
    node_count: int
    edge_count: int
    density: float
