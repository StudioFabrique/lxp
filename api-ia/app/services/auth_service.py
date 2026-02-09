# AuthService: Provides authentication and authorization logic for FastAPI routes.
# This service uses TokenService to validate JWT tokens and the repository to check permissions.
from fastapi import Depends, HTTPException, status
from app.models.pydantic.auth import TokenPayload
from app.services.token_service import TokenService, get_token_service
from app.repositories.authorization_repository import (
    get_authorization_repository,
    PgAuthorizationRepository,
)


class AuthService:
    """
    Service class for authentication and authorization logic.
    Uses TokenService to validate JWT tokens and a repository to check user permissions.
    """

    def __init__(self, auth_repository, token_service):
        """
        Initialize AuthService with a repository and a token service.
        Args:
            auth_repository: Repository for authorization checks (e.g., database access).
            token_service: Service for token validation and payload extraction.
        """
        self.auth_repository = auth_repository
        self.token_service = token_service

    async def require_auth(
        self, db, token: str, action: str, resource: str
    ) -> TokenPayload:
        """
        Validate the JWT token and check if the user is authorized to perform an action on a resource.
        Args:
            db: Database session (SQLAlchemy Session).
            token (str): JWT token string from the Authorization header.
            action (str): The action the user wants to perform (e.g., 'read', 'write').
            resource (str): The resource on which the action is performed (e.g., 'user', 'document').
        Returns:
            TokenPayload: The validated token payload if authentication and authorization succeed.
        Raises:
            HTTPException: If the token is invalid or the user is not authorized.
        """
        # Validate the token and extract the payload
        token_payload = self.token_service.check_payload(token)
        # Check if the user (by role) is authorized for the given action/resource
        self.auth_repository.get_authorization(
            db=db,
            role=token_payload.userRoles[0].role if token_payload.userRoles else "",
            action=action,
            resource=resource,
        )
        # Return the payload if everything is valid
        return token_payload


def get_auth_service(
    auth_repository: PgAuthorizationRepository = Depends(get_authorization_repository),
    token_service: TokenService = Depends(get_token_service),
) -> AuthService:
    """
    Dependency factory for AuthService.
    Injects the required repository and token service using FastAPI's Depends system.
    Returns:
        AuthService: An instance of AuthService with all dependencies injected.
    """
    return AuthService(auth_repository, token_service)
