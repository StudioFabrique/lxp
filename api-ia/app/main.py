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

from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict
from pydantic.functional_serializers import PlainSerializer
from typing import Annotated, Optional

from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from .utils.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
Base = automap_base()
Base.prepare(engine, reflect=True)

Parcours = Base.classes.Parcours
with Session(engine) as session:
    result = session.query(Parcours).all()
    for row in result:
        print(row.id, row.title)

# Custom type for ObjectId that serializes to string
PyObjectId = Annotated[ObjectId, PlainSerializer(lambda x: str(x), return_type=str)]


class UserModel(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    id: PyObjectId = Field(alias="_id")
    # Ajoute ici les autres champs de ton modèle User
    # email: str
    # name: Optional[str] = None
    email: str
    isActive: bool
    lastname: Optional[str] = None


client = AsyncIOMotorClient("mongodb://localhost:27000")
mongo_db = client.lxp

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


@app.get("/test-mongo")
async def read_mongo():
    cursor = mongo_db.users.find()
    documents = await cursor.to_list(length=100)
    print("Documents from MongoDB:", len(documents))
    # Pydantic gère automatiquement la sérialisation des ObjectId
    return [UserModel.model_validate(doc) for doc in documents]
