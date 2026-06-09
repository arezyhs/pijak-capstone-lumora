from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    name = Column(String)
    department = Column(String)
    sleep_hours = Column(Float, default=7.0)
    stress_level = Column(Integer, default=5)
    
    age = Column(Integer, default=20)
    gender = Column(String, default="Female")
    internet_access = Column(String, default="Yes")
    family_income = Column(String, default="Medium")
    parent_edu = Column(String, default="High School")
    extracurricular = Column(String, default="No")
    
    quizzes = relationship("QuizProgress", back_populates="student", cascade="all, delete")
    materials = relationship("MaterialProgress", back_populates="student", cascade="all, delete")

class QuizProgress(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    subject = Column(String)
    score = Column(Float)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="quizzes")

class MaterialProgress(Base):
    __tablename__ = "material_progress"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    material_id = Column(String)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="materials")
