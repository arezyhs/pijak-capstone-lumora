from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.content import MaterialCategory, QuizCategory, MaterialItem, QuizQuestion
from app.schemas.content import MaterialCategoryResponse, QuizCategoryResponse, MaterialItemCreate, QuizQuestionCreate
from app.api.auth import require_role

router = APIRouter()

@router.get("/content/materials", response_model=List[MaterialCategoryResponse])
def get_materials(db: Session = Depends(get_db)):
    categories = db.query(MaterialCategory).all()
    return categories

@router.get("/content/quizzes", response_model=List[QuizCategoryResponse])
def get_quizzes(db: Session = Depends(get_db)):
    categories = db.query(QuizCategory).all()
    return categories

@router.post("/content/materials/{category_id}/items", response_model=MaterialCategoryResponse)
def add_material(category_id: str, item: MaterialItemCreate, db: Session = Depends(get_db), current_user = Depends(require_role("teacher"))):
    new_item = MaterialItem(
        id=item.id,
        category_id=category_id,
        title=item.title,
        type=item.type,
        duration=item.duration,
        tags=item.tags,
        content=item.content
    )
    db.add(new_item)
    db.commit()
    # return the updated category
    return db.query(MaterialCategory).filter(MaterialCategory.id == category_id).first()

@router.post("/content/quizzes/{category_id}/questions", response_model=QuizCategoryResponse)
def add_quiz_question(category_id: str, item: QuizQuestionCreate, db: Session = Depends(get_db), current_user = Depends(require_role("teacher"))):
    new_q = QuizQuestion(
        category_id=category_id,
        question=item.question,
        options=item.options,
        correctIndex=item.correctIndex,
        tags=item.tags
    )
    db.add(new_q)
    db.commit()
    return db.query(QuizCategory).filter(QuizCategory.id == category_id).first()
