import os
import asyncpg
from dotenv import load_dotenv
from typing import AsyncGenerator
from contextlib import asynccontextmanager

load_dotenv()

DATABASE_URL = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"


async def get_db() -> AsyncGenerator[asyncpg.Connection, None]:
    conn = await asyncpg.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()


async def check_db_connection():
    async for conn in get_db():
        await conn.execute("SELECT 1")
        break  
