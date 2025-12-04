# The Witness

A system for analyzing and mapping the noosphere - tracking memes, ideas, and cultural movements across the digital landscape.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Start Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on http://localhost:5000

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev:client
```
Frontend runs on http://localhost:5173

## Features
- **Seed Injection**: Add URLs to track and analyze
- **The Loom**: Real-time graph visualization of connected ideas
- **Live Stream**: WebSocket-powered feed of processed content
- **System Logs**: Monitor system activity

## Project Structure
```
the-witness/
├── backend/          # FastAPI Python backend
│   ├── server/
│   │   ├── api/      # Routes, WebSockets
│   │   ├── services/ # Embedding, Processing, Crawling
│   │   └── models/   # Pydantic schemas
│   └── requirements.txt
└── frontend/         # React + Vite frontend
    └── client/src/
        ├── components/
        └── pages/
```

## License
MIT
