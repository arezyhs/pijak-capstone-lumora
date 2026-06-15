from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.content import MaterialCategory, MaterialItem, QuizCategory, QuizQuestion
from app.data.materials import MATERIALS_DATA
from app.data.quizzes import QUIZZES_DATA

def seed_data():
    db: Session = SessionLocal()
    try:
        # Check if materials already exist
        if db.query(MaterialCategory).first() is None:
            print("Seeding materials to database...")
            for cat_data in MATERIALS_DATA:
                cat = MaterialCategory(
                    id=cat_data["id"],
                    name=cat_data["name"],
                    color=cat_data.get("color", "#000000"),
                    tags=cat_data.get("tags", [])
                )
                db.add(cat)
                
                for mat_data in cat_data.get("materials", []):
                    mat = MaterialItem(
                        id=mat_data["id"],
                        category_id=cat.id,
                        title=mat_data["title"],
                        type=mat_data["type"],
                        duration=mat_data.get("duration", ""),
                        tags=mat_data.get("tags", []),
                        content=mat_data.get("content")
                    )
                    db.add(mat)
            db.commit()

        # Check if quizzes already exist
        if db.query(QuizCategory).first() is None:
            print("Seeding quizzes to database...")
            for quiz_data in QUIZZES_DATA:
                quiz_cat = QuizCategory(
                    id=quiz_data["id"],
                    title=quiz_data["title"],
                    icon=quiz_data.get("icon", ""),
                    color=quiz_data.get("color", "#000000"),
                    tags=quiz_data.get("tags", [])
                )
                db.add(quiz_cat)
                
                for q_data in quiz_data.get("questions", []):
                    q = QuizQuestion(
                        category_id=quiz_cat.id,
                        question=q_data["question"],
                        options=q_data["options"],
                        correctIndex=q_data["correctIndex"],
                        tags=q_data.get("tags", [])
                    )
                    db.add(q)
            db.commit()
    finally:
        db.close()
