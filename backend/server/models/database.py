from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./witness.db")

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

class MemeEvent(Base):
    __tablename__ = "meme_events"
    
    id = Column(String, primary_key=True)
    source = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    virality = Column(Float, default=0.0)
    tags = Column(JSON, default=list)
    embedding = Column(JSON, nullable=True)
    processed = Column(Boolean, default=False)

class LoomNode(Base):
    __tablename__ = "loom_nodes"
    
    id = Column(String, primary_key=True)
    x = Column(Float, default=50.0)
    y = Column(Float, default=50.0)
    size = Column(Float, default=1.0)
    color = Column(String, default="#00ff88")
    pulse = Column(Boolean, default=False)
    label = Column(String, nullable=True)
    cluster = Column(String, nullable=True)
    embedding = Column(JSON, nullable=True)

class LoomEdge(Base):
    __tablename__ = "loom_edges"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    weight = Column(Float, default=1.0)
    edge_type = Column(String, default="semantic")

class CrawlSeed(Base):
    __tablename__ = "crawl_seeds"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    url = Column(String, nullable=False)
    seed_type = Column(String, default="keyword")
    priority = Column(String, default="standard")
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    last_crawled = Column(DateTime, nullable=True)

class SystemConfig(Base):
    __tablename__ = "system_config"
    
    key = Column(String, primary_key=True)
    value = Column(JSON, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

class WorkerStatus(Base):
    __tablename__ = "worker_status"
    
    id = Column(String, primary_key=True)
    status = Column(String, default="IDLE")
    current_task = Column(String, nullable=True)
    domain_shard = Column(String, nullable=True)
    throughput = Column(Float, default=0.0)
    last_heartbeat = Column(DateTime, default=datetime.utcnow)

class AgentLog(Base):
    __tablename__ = "agent_logs"
    
    id = Column(String, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    agent_name = Column(String, nullable=False)
    log_type = Column(String, default="INFO")
    message = Column(Text, nullable=False)


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session():
    async with async_session() as session:
        yield session
