import json
import os
import sys

# Add backend dir to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.student import Student, QuizProgress
from app.api.auth import get_password_hash

def seed_students():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Student).count() > 0:
            print("Database already has students. Skipping seed.")
            # return
            pass # allow adding more or we can just continue
        
        json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../ml/data/Students Performance Dataset.json'))
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        print(f"Loaded {len(data)} records from dataset.")
        
        # Pick first 20 students
        subset = data[:20]
        
        for idx, row in enumerate(subset):
            # username from email or just generate one
            username = f"student_{idx+1}"
            
            # check if exists
            if db.query(User).filter(User.username == username).first():
                continue
                
            # Create User
            user = User(
                username=username,
                name=f"{row['First_Name']} {row['Last_Name']}",
                hashed_password=get_password_hash("password123"),
                role="student"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            # Create Student
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
            
            # Add some Quiz progress based on dataset
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
            
        print("Successfully seeded 20 students from dataset!")
            
    finally:
        db.close()

if __name__ == "__main__":
    seed_students()
