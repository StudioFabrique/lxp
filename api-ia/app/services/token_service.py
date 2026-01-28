from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status

from app.models.pydantic.auth import TokenPayload
from app.repositories.authorization_repository import PgAuthorizationRepository
from app.utils.config import SECRET_KEY, ALGORITHM


class TokenService:
    def __init__(self):
        pass

    def check_payload(self, token: str) -> TokenPayload:
        # Implémente la logique pour valider le token et retourner le payload
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user = TokenPayload(**payload)

            print(f"Token payload: {user}")

            return user

        except JWTError as e:
            print(f"JWTError: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide ou expiré",
                headers={"WWW-Authenticate": "Bearer"},
            )


def get_token_service() -> TokenService:
    return TokenService()
