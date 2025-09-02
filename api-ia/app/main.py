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

from app.utils.config import ALLOWED_ORIGINS
from app.utils.logging_setup import LoggerSetup
from app.routes import generate


# Initialisation du logger
logger = LoggerSetup()

app = FastAPI()

app.include_router(generate.router)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Ajout du middleware CORS avec les paramètres de sécurité
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Disposition"],
    max_age=600,
)


# Gestionnaire personnalisé pour les exceptions HTTP
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request, exc):
    print(f"OMG an HTTP error! {repr(exc)}")
    if exc.status_code != 429:
        logger.write_log(exc.detail, request)
    return await http_exception_handler(request, exc)


# Gestionnaire pour les erreurs de validation des requêtes
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"OMG! The client sent invalid data!: {exc}")
    logger.write_valid(request, exc)
    return await request_validation_exception_handler(request, exc)


# Endpoint pour vérifier le bon état de fonctionnement du service
@app.get("/health")
async def health_check():
    return {"status": "ok"}
