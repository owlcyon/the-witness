#!/usr/bin/env bash
set -e

# Run migrations (todo: adding later)
# alembic upgrade head

exec gunicorn -k uvicorn.workers.UvicornWorker -c gunicorn_conf.py app.main:app
