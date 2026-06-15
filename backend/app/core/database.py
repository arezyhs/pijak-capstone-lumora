import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Use external database URL if available (e.g. Supabase, Neon)
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./lumora.db")

is_sqlite = SQLALCHEMY_DATABASE_URL.startswith("sqlite")

# PostgreSQL doesn't need check_same_thread
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
