# The Witness

A production-ready system for analyzing and mapping the noosphere - tracking memes, ideas, and cultural movements across the digital landscape.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- (Optional) Python 3.11+ for local development

### 1. Start All Services
```bash
docker compose up -d
```
This starts:
- **Backend** (FastAPI): http://localhost:8000
- **PostgreSQL** (with pgvector): localhost:5432
- **Redis**: localhost:6379
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

### 2. Run Database Migrations
```bash
docker compose exec backend alembic upgrade head
```

### 3. View API Docs
Open http://localhost:8000/docs for interactive Swagger documentation.

---

## 📐 Architecture

```
the-witness/
├── docker-compose.yml     # Infrastructure orchestration
├── prometheus.yml         # Metrics scraping config
├── backend/
│   ├── Dockerfile
│   ├── alembic/           # Database migrations
│   │   └── versions/
│   ├── app/               # Production FastAPI application
│   │   ├── api/           # Routes, deps, endpoints
│   │   ├── core/          # Config, Security, Logging, Exceptions
│   │   ├── db/            # SQLAlchemy session, base
│   │   ├── models/        # User, Meme, Edge (SQLAlchemy)
│   │   ├── schemas/       # Pydantic validation
│   │   └── services/      # Business logic (Graph, Processor, WS)
│   └── requirements.txt   # Pinned dependencies
└── frontend/              # React + Vite frontend
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Persistent Graph** | PostgreSQL + pgvector for vector similarity search |
| **Redis Queues** | Reliable message processing, no data loss on restart |
| **JWT Auth** | Secure authentication with refresh tokens |
| **Rate Limiting** | Redis-backed, per-user/IP protection |
| **Circuit Breakers** | Graceful degradation for external services |
| **Observability** | Prometheus metrics, Grafana dashboards, structured logging |
| **Health Checks** | `/health/live` and `/health/ready` for orchestrators |
| **WebSockets** | Real-time updates with delta broadcasting |

---

## 🔗 Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/login/access-token` | POST | Get JWT token |
| `/api/v1/graph/ingest` | POST | Queue content for processing |
| `/api/v1/graph/search?query=...` | GET | Vector similarity search |
| `/api/v1/graph/stats` | GET | Graph statistics |
| `/api/v1/ws` | WS | Real-time stream |
| `/health/ready` | GET | DB/Redis connectivity check |
| `/metrics` | GET | Prometheus metrics |

---

## 🛠️ Development

### Local Python Dev (without Docker)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
> Requires local PostgreSQL and Redis instances.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Monitoring

- **Prometheus**: http://localhost:9090 - Query metrics
- **Grafana**: http://localhost:3000 - Dashboards (login: admin/admin)
- **Logs**: Structured JSON via `structlog`

---

## License
MIT
