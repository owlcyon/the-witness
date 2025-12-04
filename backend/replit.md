# The Witness - Autonomous Distributed API for Eternal Threads

## Overview
The Witness is a backend API system designed to track, synthesize, and map meme unfoldings across the digital noosphere. It crawls platforms like X (Twitter), generates semantic embeddings, and creates a networked knowledge graph of interconnected ideas, themes, and influences.

**Current State**: Phase 1 MVP Complete - Core Pipeline (Ingest → Embed → Graph → API)

## Project Architecture

```
/server
├── api/
│   ├── routes.py        # REST API endpoints
│   └── websockets.py    # WebSocket handlers for live streaming
├── models/
│   ├── database.py      # SQLAlchemy models (MemeEvent, LoomNode, etc.)
│   └── schemas.py       # Pydantic schemas for API validation
├── services/
│   ├── embedding_service.py   # TF-IDF based embedding generation
│   ├── graph_service.py       # NetworkX graph for semantic mapping
│   ├── meme_processor.py      # Content processing pipeline
│   └── system_monitor.py      # System health and worker monitoring
└── utils/
main.py                  # FastAPI application entry point
```

## API Endpoints

### REST Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/status` | System health (CPU, workers, queue depth) |
| GET | `/api/v1/stream` | Paginated historical meme events |
| GET | `/api/v1/graph/nodes` | Full graph snapshot (nodes + edges + stats) |
| POST | `/api/v1/seeds` | Inject new crawl seeds |
| GET | `/api/v1/config` | Retrieve system configuration |
| POST | `/api/v1/config` | Update system configuration |
| GET | `/api/v1/workers` | Worker status list |
| GET | `/api/v1/logs` | Agent activity logs |
| POST | `/api/v1/ingest` | Directly ingest content into the pipeline |

### WebSocket Endpoints
| Endpoint | Description |
|----------|-------------|
| `/ws/stream` | Live meme ingestion feed |
| `/ws/loom` | Live graph topology updates |

## Data Models

### MemeEvent
```json
{
  "id": "string",
  "source": "X (Twitter) | Reddit | 4chan | Substack | Web",
  "content": "string",
  "timestamp": "ISO 8601",
  "virality": 0-100,
  "tags": ["string"],
  "embedding": [float]
}
```

### LoomNode (Graph Visualization)
```json
{
  "id": "string",
  "x": 0-100,
  "y": 0-100,
  "size": float,
  "color": "hex",
  "pulse": boolean,
  "metadata": { "label": "string", "cluster": "string" }
}
```

### WorkerNode
```json
{
  "id": "worker-01",
  "status": "IDLE | ACTIVE | ERROR",
  "current_task": "string",
  "domain_shard": "string",
  "throughput": float
}
```

## Technical Stack
- **Framework**: FastAPI (async, WebSocket support)
- **Graph Engine**: NetworkX
- **Embeddings**: Lightweight TF-IDF (upgradable to sentence-transformers)
- **Database**: SQLite (async) - ready for PostgreSQL + pgvector
- **Clustering**: Automatic cluster inference (spiritual, ai, cultural, political)

## Recent Changes
- **2024-12-02**: Initial Phase 1 MVP implementation
  - Core REST API endpoints
  - WebSocket streaming for live updates
  - NetworkX graph with semantic edge weighting
  - Embedding pipeline with tag extraction
  - System monitoring and agent logging

## Frontend Integration Notes
- Frontend expects WebSocket connections at `/ws/stream` and `/ws/loom`
- Graph data format matches `LoomNode` and `LoomEdge` interfaces
- All hosts allowed via CORS for dev environment
- API responses match the interfaces defined in `BACKEND_SPEC.md`

## Next Steps (Phase 2 - Autonomy)
1. Add Celery/Redis for distributed task queues
2. Implement Scrapy-based crawlers for X/Twitter
3. Upgrade to sentence-transformers for better embeddings
4. Add PostgreSQL + pgvector for production
5. Implement LangChain agents for autonomy loop
