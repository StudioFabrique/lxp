# db.py

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from ..utils.config import MONGODB_URL


client: AsyncIOMotorClient | None = None


async def connect_db():
    global client
    client = AsyncIOMotorClient(MONGODB_URL)


async def close_db():
    global client
    if client:
        client.close()


def get_mg_database() -> AsyncIOMotorDatabase:
    return client["lxp"]
