# The Witness - Backend Architecture Specification

This document serves as the blueprint for implementing the backend logic to support the frontend interface designed for "The Witness".

## 1. System Overview

The Witness is an autonomous distributed API that crawls, synthesizes, and maps the noosphere. The backend must support:
- **Distributed Crawling**: Sharded workers harvesting from X, Reddit, etc.
- **AI Synthesis**: Embedding generation (BERT/HF) and Semantic Mapping.
- **Real-time Telemetry**: WebSocket streams for crawler status and meme ingestion.
- **Autonomy Loop**: Self-healing agents and feedback loops.

## 2. API Architecture

Recommended Stack: **Python (FastAPI)** or **Node.js (Express/NestJS)**.
Communication Patterns:
- **REST API**: For configuration, historical data, and system control.
- **WebSockets**: For live "Meme Stream", "Loom" visualization updates, and "Agent Log" events.

### 2.1 Data Models (JSON Schemas)

The frontend expects the following data structures. Ensure your API responses match these interfaces.

#### Meme Event (Stream)
```typescript
interface MemeEvent {
  id: string;
  source: "X (Twitter)" | "Reddit" | "4chan" | "Substack";
  content: string;      // The text payload
  timestamp: string;    // ISO 8601
  virality: number;     // 0-100 score
  tags: string[];       // Extracted topics
  embedding?: number[]; // Vector (backend internal, optional for frontend)
}
```

#### Loom Node (Graph Viz)
```typescript
interface LoomNode {
  id: number | string;
  x: number;            // 0-100 (Canvas position)
  y: number;            // 0-100
  size: number;         // Visual weight
  color: string;        // Hex or CSS var
  pulse: boolean;       // Active state
  metadata: {
    label: string;
    cluster: string;
  }
}
```

#### Worker Status (Crawler Nexus)
```typescript
interface WorkerNode {
  id: string;           // e.g., "worker-01"
  status: "IDLE" | "ACTIVE" | "ERROR";
  current_task: string; // e.g., "crawling x.com/u/elonmusk"
  domain_shard: string; // e.g., "x.com"
  throughput: number;   // items/sec
}
```

#### Agent Log (Autonomy Engine)
```typescript
interface LogEntry {
  id: string;
  timestamp: string;
  agent_name: string;   // e.g., "SENTINEL-BETA"
  type: "INFO" | "WARN" | "ACTION" | "SUCCESS";
  message: string;
}
```

## 3. Integration Strategy

### 3.1 X (Twitter) & Social Data
*   **Official API**: Use Bearer Tokens for "Critical" priority seeds (Real-time).
*   **Scrapers (Scrapy/Selenium)**: Use for "Standard" priority to save API costs.
*   **Implementation**:
    *   The `SystemPage` provides input for API Keys.
    *   Backend should prioritize Official API -> Fallback to Scraper.

### 3.2 AI & Embeddings
*   **Model**: Use Hugging Face `sentence-transformers` (e.g., `all-MiniLM-L6-v2`) for speed.
*   **Vector Store**: Use `pgvector` (PostgreSQL) or `ChromaDB` to store embeddings.
*   **Graph**: Use `NetworkX` (Python) to compute centrality and hypergraph edges.

### 3.3 Autonomy Loop
*   **Queue System**: RabbitMQ or Redis (Celery).
*   **Agents**: Implement LangChain agents that monitor the Queue depth.
    *   If `depth > threshold`, spawn new Lambda workers.
    *   If `error_rate > 5%`, trigger `SENTINEL` agent to restart worker.

## 4. API Endpoints (MVP)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/status` | System health (CPU, GPU, Uptime) |
| `GET` | `/api/v1/stream` | Historical meme events (with pagination) |
| `WS` | `/ws/stream` | Live meme ingestion feed |
| `WS` | `/ws/loom` | Live node topology updates |
| `GET` | `/api/v1/graph/nodes` | Full graph snapshot for Semantic Map |
| `POST` | `/api/v1/seeds` | Inject new crawl seed (from Setup/Loom page) |
| `GET` | `/api/v1/config` | Retrieve system config |
| `POST` | `/api/v1/config` | Update system config (API Keys, Thresholds) |

## 5. MVP vs Full Autonomy Scope

**Phase 1: Core Pipeline (Immediate MVP)**
1.  **Ingest**: Connect to X API (or mock) to fetch real tweets.
2.  **Embed**: Run text through a local embedding model.
3.  **Stream**: Push data to `/ws/stream` to light up the frontend.
4.  **Graph**: Simple co-occurrence graph (Entity A appears with Entity B).

**Phase 2: Autonomy Layer**
1.  **Agents**: Implement the `SENTINEL` and `ORCHESTRATOR` logic.
2.  **Feedback**: Use high-virality outputs to auto-generate new seeds.
3.  **Scale**: Kubernetes/ECS integration.

## 6. "Perfect Match" Guidelines

To ensure the backend "clicks" with the frontend:
1.  **Mock Data First**: The frontend currently uses `MOCK_EVENTS` and `nodes` array. Replace these with API calls but **keep the exact field names**.
2.  **WebSockets**: The frontend is designed for *liveness*. Do not rely solely on polling.
3.  **Colors**: The frontend sends specific color variables (e.g., `var(--color-primary)`). The backend should ideally respect these or send semantic types (`type: "spiritual"`) that the frontend maps to colors.

## 7. Implementation Notes for Replit

*   **Database**: Use the attached PostgreSQL (`@neondatabase/serverless`) for persistent storage.
*   **Drizzle ORM**: Use Drizzle for type-safe DB interactions.
*   **Background Jobs**: Since this is a single Replit instance, use `BullMQ` (Node) or Python `Celery` with a Redis instance (if available) or simple in-memory queues for MVP.

---

**Ready to Build?**
Switch to the Backend Tab and start by implementing the `/api/v1/status` endpoint to see the Dashboard "System Online" indicator light up.
