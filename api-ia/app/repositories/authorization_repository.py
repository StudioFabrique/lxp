from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.utils.database import Authorization


class PgAuthorizationRepository:
    def __init__(self):
        pass

    async def get_authorization(
        self, db: Session, role: str, action: str, resource: str
    ) -> Authorization:
        # Implémente la logique pour vérifier l'autorisation dans PostgreSQL
        authorization = (
            db.query(Authorization)
            .filter_by(role=role, action=action, resource=resource)
            .first()
        )
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="authorization_not_found"
            )
        return authorization


def get_authorization_repository() -> PgAuthorizationRepository:
    return PgAuthorizationRepository()
