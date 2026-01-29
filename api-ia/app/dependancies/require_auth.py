from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .pg_session import get_db
from app.models.pydantic.auth import TokenPayload
from app.services.auth_service import get_auth_service
from app.services.token_service import get_token_service
from app.repositories.authorization_repository import get_authorization_repository

# Security scheme for extracting the Bearer token from the Authorization header
security = HTTPBearer()


def require_auth(action: str, resource: str):
    """
    Dependency factory for authentication and authorization.
    Checks if the user is authenticated and authorized to perform a specific action on a resource.

    Args:
        action (str): The action the user wants to perform (e.g., 'read', 'write').
        resource (str): The resource on which the action is performed (e.g., 'user', 'document').

    Returns:
        dependency: A FastAPI dependency that returns the validated TokenPayload if authorized.
    """

    async def dependency(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        auth_service=Depends(get_auth_service),
        db: Session = Depends(get_db),
    ) -> TokenPayload:
        # Extract the JWT token from the Authorization header
        token = credentials.credentials
        # Call the AuthService to validate the token and check permissions
        payload = await auth_service.require_auth(db, token, action, resource)
        # payload is a TokenPayload object if authentication and authorization succeed
        return payload

    return dependency
