from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.utils.database import Authorization


class PgAuthorizationRepository:
    def __init__(self):
        pass

    def get_authorization(
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
                status_code=status.HTTP_404_NOT_FOUND, detail="authorization_not_found"
            )
        return authorization
