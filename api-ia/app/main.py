"""
main.py

This module initializes the FastAPI application, configures middleware, exception handlers, logging, and includes the chatbot router.
"""

from fastapi import FastAPI
from fastapi.exception_handlers import (
    http_exception_handler,
    request_validation_exception_handler,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi import _rate_limit_exceeded_handler
from app.utils.limiter import limiter
from slowapi.errors import RateLimitExceeded

# Import configuration, logging, and routes
from app.utils.config import ALLOWED_ORIGINS
from app.utils.logging_setup import LoggerSetup
from app.routes import chatbot

# Initialize the logger
logger = LoggerSetup()

# Create FastAPI app instance
app = FastAPI()

# Include chatbot router
app.include_router(chatbot.router)

# Configure rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware for security and cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Allowed origins from config
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Disposition"],
    max_age=600,
)


# Custom handler for HTTP exceptions
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    """
    Handles HTTP exceptions, logs details except for rate limit errors (429).
    """
    print(f"OMG an HTTP error! {repr(exc)}")
    if exc.status_code != 429:
        logger.write_log(exc.detail, request)
    return await http_exception_handler(request, exc)


# Handler for request validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    """
    Handles validation errors for incoming requests and logs them.
    """
    print(f"OMG! The client sent invalid data!: {exc}")
    logger.write_valid(request, exc)
    return await request_validation_exception_handler(request, exc)


# Health check endpoint to verify service status
@app.get("/health")
async def health_check():
    """
    Returns service status for health checks.
    """
    return {"status": "ok"}
