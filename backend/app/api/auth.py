from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt

from app.core.database import get_db
from app.models.user import User
from app.models.student import Student
from pydantic import BaseModel

import os

# --- Configuration ---
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "lumora-dev-secret-key-change-in-prod")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

router = APIRouter()

# --- Pydantic Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str
    name: str
    created_at: str
    has_completed_onboarding: bool

class RegisterRequest(BaseModel):
    username: str
    password: str
    name: str
    role: str
    invite_code: Optional[str] = None

# --- Utility Functions ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Dependencies ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def require_role(required_role: str):
    def role_dependency(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation requires {required_role} role"
            )
        return current_user
    return role_dependency

# --- Routes ---
@router.post("/register", response_model=Token)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    if payload.role not in ["student", "teacher"]:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    if payload.role == "teacher":
        expected_code = os.environ.get("TEACHER_INVITE_CODE", "lumora-admin-secret-123")
        if payload.invite_code != expected_code:
            raise HTTPException(status_code=403, detail="Invalid teacher invite code")
        
    existing_user = db.query(User).filter(User.username == payload.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
        
    user = User(
        username=payload.username,
        name=payload.name,
        hashed_password=get_password_hash(payload.password),
        role=payload.role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    
    has_onboarding = False
    if user.role == "student":
        student = db.query(Student).filter(Student.user_id == user.username).first()
        if student:
            has_onboarding = student.has_completed_onboarding
            
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": user.role, 
        "username": user.username, 
        "name": user.name,
        "created_at": user.created_at.isoformat() if user.created_at else "",
        "has_completed_onboarding": has_onboarding
    }

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    
    has_onboarding = False
    if user.role == "student":
        student = db.query(Student).filter(Student.user_id == user.username).first()
        if student:
            has_onboarding = student.has_completed_onboarding
            
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "role": user.role, 
        "username": user.username, 
        "name": user.name or user.username,
        "created_at": user.created_at.isoformat() if user.created_at else "",
        "has_completed_onboarding": has_onboarding
    }
