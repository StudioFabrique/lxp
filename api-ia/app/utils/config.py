# Import des modules nécessaires
import os
from dotenv import load_dotenv


# Chargement des variables d'environnement depuis le fichier .env
load_dotenv()

# CORS rules
ALLOWED_ORIGINS = []
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
# URL de connexion à la base de données
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL loaded: {DATABASE_URL is not None}")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27000")
SECRET_KEY = os.getenv("SECRET_KEY")
print("SECRET_KEY loaded:", SECRET_KEY is not None)
if SECRET_KEY is None:
    raise ValueError("SECRET_KEY must be set in environment variables")
ALGORITHM = os.getenv("ALGORITHM")
if ALGORITHM is None:
    ALGORITHM = "HS256"  # Default algorithm
