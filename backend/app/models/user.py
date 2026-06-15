from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String) # Store real name
    hashed_password = Column(String)
    role = Column(String) # "student" or "teacher"
    created_at = Column(DateTime, default=datetime.utcnow)
