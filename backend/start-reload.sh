#!/usr/bin/env bash
set -e

# Run migrations (todo: adding later)
# alembic upgrade head

exec uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
