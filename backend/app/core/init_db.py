from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.content import MaterialCategory, MaterialItem, QuizCategory, QuizQuestion
from app.models.user import User
from app.models.student import Student, QuizProgress
from app.api.auth import get_password_hash
from app.data.materials import MATERIALS_DATA
from app.data.quizzes import QUIZZES_DATA
import json
import os

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

        # Check if students already exist
        if db.query(Student).count() < 20:
            print("Seeding students to database from dataset...")
            json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ml/data/Students Performance Dataset.json'))
            if os.path.exists(json_path):
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                subset = data[:20]
                for idx, row in enumerate(subset):
                    username = f"student_{idx+1}"
                    if db.query(User).filter(User.username == username).first():
                        continue
                        
                    user = User(
                        username=username,
                        name=f"{row['First_Name']} {row['Last_Name']}",
                        hashed_password=get_password_hash("password123"),
                        role="student"
                    )
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                    
                    student = Student(
                        user_id=username,
                        name=user.name,
                        department=row['Department'],
                        sleep_hours=float(row['Sleep_Hours_per_Night']),
                        stress_level=int(row['Stress_Level (1-10)']),
                        age=int(row['Age']),
                        gender=row['Gender'],
                        internet_access=row['Internet_Access_at_Home'],
                        family_income=row['Family_Income_Level'],
                        parent_edu=row['Parent_Education_Level'],
                        extracurricular=row['Extracurricular_Activities'],
                        has_completed_onboarding=True
                    )
                    db.add(student)
                    db.commit()
                    db.refresh(student)
                    
                    quiz_score = float(row['Quizzes_Avg'])
                    quiz = QuizProgress(
                        student_id=student.id,
                        subject=row['Department'],
                        score=quiz_score
                    )
                    db.add(quiz)
                    
                    midterm_score = float(row['Midterm_Score'])
                    quiz2 = QuizProgress(
                        student_id=student.id,
                        subject=row['Department'] + " Midterm",
                        score=midterm_score
                    )
                    db.add(quiz2)
                    
                    db.commit()
                print("Successfully seeded students!")
    finally:
        db.close()
