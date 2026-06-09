from fastapi import APIRouter
from app.data.materials import MATERIALS_DATA
from app.data.quizzes import QUIZZES_DATA

router = APIRouter()

@router.get("/content/materials")
def get_materials():
    return MATERIALS_DATA

@router.get("/content/quizzes")
def get_quizzes():
    return QUIZZES_DATA
