from pydantic import BaseModel
from typing import List, Optional

class MaterialItemResponse(BaseModel):
    id: str
    title: str
    type: str
    duration: str
    tags: List[str]
    content: Optional[str] = None

    class Config:
        from_attributes = True

class MaterialCategoryResponse(BaseModel):
    id: str
    name: str
    color: str
    tags: List[str]
    materials: List[MaterialItemResponse]

    class Config:
        from_attributes = True

class QuizQuestionResponse(BaseModel):
    question: str
    options: List[str]
    correctIndex: int
    tags: List[str]

    class Config:
        from_attributes = True

class QuizCategoryResponse(BaseModel):
    id: str
    title: str
    icon: str
    color: str
    tags: List[str]
    questions: List[QuizQuestionResponse]

    class Config:
        from_attributes = True

class MaterialItemCreate(BaseModel):
    id: str
    title: str
    type: str
    duration: str
    tags: List[str]
    content: Optional[str] = None

class QuizQuestionCreate(BaseModel):
    question: str
    options: List[str]
    correctIndex: int
    tags: List[str]
