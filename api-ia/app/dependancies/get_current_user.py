# auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Annotated, Callable
from pydantic import BaseModel
from app.models.pydantic.auth import Role
from app.repositories.authorization_repository import PgAuthorizationRepository
from .pg_session import get_db
from sqlalchemy.orm import Session

from ..utils.config import SECRET_KEY

# Le même secret que dans ton Express

ALGORITHM = "HS256"  # ou RS256 si tu utilises des clés asymétriques

security = HTTPBearer()


class TokenPayload(BaseModel):
    userId: str
    userRoles: list[Role]
    exp: int
    iat: int


def get_authorization_repository():
    return PgAuthorizationRepository()


async def _get_current_user(
    credentials: HTTPAuthorizationCredentials,
    authorization_repository: PgAuthorizationRepository,
    db: Session,
    action: str | None = None,
    resource: str | None = None,
) -> TokenPayload:
    """Fonction interne pour récupérer l'utilisateur et vérifier les autorisations."""
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user = TokenPayload(**payload)

        # Si action et resource sont spécifiés, vérifier l'autorisation
        if action and resource:
            roles = payload.get("userRoles", [])
            role = roles[0]["role"] if roles else ""

            is_authorized = authorization_repository.get_authorization(
                db=db, role=role, action=action, resource=resource
            )

            if not is_authorized:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Non autorisé: {role} ne peut pas {action} sur {resource}",
                )

        return user

    except JWTError as e:
        print(f"JWTError: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )


def require_auth(action: str | None = None, resource: str | None = None) -> Callable:
    """
    Factory pour créer une dépendance d'authentification avec vérification des permissions.

    Usage:
        @app.get("/test")
        async def test(user: TokenPayload = Depends(require_auth("GET", "test"))):
            ...
    """

    async def dependency(
        credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
        authorization_repository: Annotated[
            PgAuthorizationRepository, Depends(get_authorization_repository)
        ],
        db: Annotated[Session, Depends(get_db)],
    ) -> TokenPayload:
        return await _get_current_user(
            credentials, authorization_repository, db, action, resource
        )

    return dependency


# Raccourci sans vérification de permission (juste auth)
async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    authorization_repository: Annotated[
        PgAuthorizationRepository, Depends(get_authorization_repository)
    ],
    db: Annotated[Session, Depends(get_db)],
) -> TokenPayload:
    return await _get_current_user(credentials, authorization_repository, db)


# Raccourci pour l'injection simple (sans vérification de ressource)
CurrentUser = Annotated[TokenPayload, Depends(get_current_user)]
