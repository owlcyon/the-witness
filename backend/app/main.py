from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging, log
from app.db.session import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    setup_logging()
    log.info("Starting up...")
    
    # Verify DB connection
    try:
        async with engine.begin() as conn:
            # Check for pgvector extension
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        log.info("Database connection established")
    except Exception as e:
        log.error("Database connection failed", error=str(e))
        # Don't exit, but log critical error. 
        # In a real orchestrator, this might trigger a restart.

    # Initialize Rate Limiter
    from app.core.rate_limit import init_rate_limiter
    try:
        await init_rate_limiter()
        log.info("Rate limiter initialized")
    except Exception as e:
        log.error("Rate limiter failed to init", error=str(e))
        
    yield
    
    # Shutdown
    log.info("Shutting down...")
    await engine.dispose()

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
    )

    # CORS
    if settings.BACKEND_CORS_ORIGINS:
        application.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    from app.api.v1.api import api_router
    application.include_router(api_router, prefix=settings.API_V1_STR)

    # Health Checks (mounted at root /health for convention)
    from app.api.v1.endpoints import health
    application.include_router(health.router, prefix="/health", tags=["health"])

    # Prometheus
    from prometheus_fastapi_instrumentator import Instrumentator
    Instrumentator().instrument(application).expose(application)

    return application

app = create_application()

# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response

# Global Exception Handler
from fastapi.responses import JSONResponse
from fastapi import Request
from app.core.exceptions import AppError
from app.core.logging import log

@app.exception_handler(AppError)
async def handle_app_error(request: Request, exc: AppError):
    log.error("AppError occurred", 
             error=exc.message, 
             type=exc.__class__.__name__, 
             context=exc.context,
             path=request.url.path)
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.message,
            "type": exc.__class__.__name__,
            # "request_id": request.state.request_id # Todo: Add middleware for request_id
        }
    )

# Import text for raw SQL execution in lifespan
from sqlalchemy import text
