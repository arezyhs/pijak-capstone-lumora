from sqlalchemy import Column, String, Integer, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base

class MaterialCategory(Base):
    __tablename__ = "material_categories"

    id = Column(String, primary_key=True, index=True) # e.g. "matematika"
    name = Column(String)
    color = Column(String)
    tags = Column(JSON, default=list)

    materials = relationship("MaterialItem", back_populates="category", cascade="all, delete")

class MaterialItem(Base):
    __tablename__ = "material_items"

    id = Column(String, primary_key=True, index=True) # e.g. "mat-001"
    category_id = Column(String, ForeignKey("material_categories.id"))
    title = Column(String)
    type = Column(String)
    duration = Column(String)
    tags = Column(JSON, default=list)
    content = Column(Text, nullable=True)

    category = relationship("MaterialCategory", back_populates="materials")

class QuizCategory(Base):
    __tablename__ = "quiz_categories"

    id = Column(String, primary_key=True, index=True) # e.g. "Matematika"
    title = Column(String)
    icon = Column(String)
    color = Column(String)
    tags = Column(JSON, default=list)

    questions = relationship("QuizQuestion", back_populates="category", cascade="all, delete")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    category_id = Column(String, ForeignKey("quiz_categories.id"))
    question = Column(Text)
    options = Column(JSON, default=list) # e.g. ["1", "2", "3", "4"]
    correctIndex = Column(Integer, name="correct_index") # using correctIndex for camelCase mapping or just correct_index
    tags = Column(JSON, default=list)

    category = relationship("QuizCategory", back_populates="questions")
