from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, field_validator
from pydantic.functional_serializers import PlainSerializer
from pydantic.functional_validators import BeforeValidator
from typing import Annotated, Optional, Any


# Validateur qui accepte ObjectId ou string et retourne ObjectId
def validate_object_id(v: Any) -> ObjectId:
    if isinstance(v, ObjectId):
        return v
    if isinstance(v, str) and ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError(f"Invalid ObjectId: {v}")


# Type pour MongoDB: accepte ObjectId ou string, sérialise en string
PyObjectId = Annotated[
    ObjectId,
    BeforeValidator(validate_object_id),
    PlainSerializer(lambda x: str(x), return_type=str),
]


class Role(BaseModel):
    """
    Modèle de rôle pour les données provenant du JWT.
    Les _id sont déjà des strings dans le token JWT (sérialisés par Node.js).
    """

    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)

    id: str = Field(alias="_id")  # String car vient du JWT, pas de MongoDB
    role: str
    label: str
    rank: int


class Authorization(BaseModel):
    role: str
    action: str
    resource: str


class TokenPayload(BaseModel):
    userId: str
    userRoles: list[Role]
    exp: int
    iat: int


class UserModel(BaseModel):
    """Modèle utilisateur pour les données MongoDB."""

    model_config = ConfigDict(arbitrary_types_allowed=True, populate_by_name=True)

    id: str = Field(alias="_id")
    email: str
    isActive: bool
    lastname: Optional[str] = None
