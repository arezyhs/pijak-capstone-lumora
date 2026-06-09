from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models.student import Student, QuizProgress
from app.api.auth import get_current_user, require_role, User
from app.schemas.learning import (
    DashboardResponse,
    ProgressSummary,
    QuizSummary,
    RecommendationRequest,
    RecommendationResponse,
    TeacherOverview,
    QuizSubmission,
    QuizResult
)
from app.services.recommender import recommend_learning_path

router = APIRouter()

def seed_student_if_needed(db: Session, student_id: str):
    """Seed dummy data for the MVP if student doesn't exist."""
    student = db.query(Student).filter(Student.user_id == student_id).first()
    if not student:
        student = Student(user_id=student_id, name="Nadia Putri", department="Science")
        db.add(student)
        db.commit()
        db.refresh(student)
        
        # Add a couple of mock quiz records
        quiz1 = QuizProgress(student_id=student.id, subject="Matematika", score=85.0)
        quiz2 = QuizProgress(student_id=student.id, subject="Sains", score=45.0) # Poor score to trigger AI remedial
        db.add_all([quiz1, quiz2])
        db.commit()
    return student

@router.post("/recommendations", response_model=RecommendationResponse)
def create_recommendation(payload: RecommendationRequest) -> RecommendationResponse:
    return recommend_learning_path(payload)


@router.post("/students/{student_id}/submit_quiz", response_model=QuizResult)
def submit_quiz(student_id: str, payload: QuizSubmission, db: Session = Depends(get_db), current_user: User = Depends(require_role("student"))) -> QuizResult:
    student = seed_student_if_needed(db, student_id)
    
    # Save the new quiz
    new_quiz = QuizProgress(student_id=student.id, subject=payload.subject, score=payload.score)
    db.add(new_quiz)
    db.commit()
    
    # Trigger AI recommender to get the new path difficulty
    completion_rate = 0.50 # proxy
    recommendation = recommend_learning_path(
        RecommendationRequest(
            student_id=student_id,
            subject=payload.subject,
            quiz_score=payload.score,
            completion_rate=completion_rate,
            weak_topics=[payload.subject],
        )
    )
    
    return QuizResult(
        message="Quiz berhasil disubmit dan AI telah memperbarui rute belajar Anda.",
        quiz_score=payload.score,
        new_difficulty=recommendation.difficulty
    )


@router.get("/students/{student_id}/dashboard", response_model=DashboardResponse)
def get_student_dashboard(student_id: str, db: Session = Depends(get_db), current_user: User = Depends(require_role("student"))) -> DashboardResponse:
    # 1. Seed or retrieve student from database
    student = seed_student_if_needed(db, student_id)
    
    # 2. Get latest quiz
    latest_quiz_record = db.query(QuizProgress).filter(QuizProgress.student_id == student.id).order_by(QuizProgress.submitted_at.desc()).first()
    if not latest_quiz_record:
        raise HTTPException(status_code=404, detail="No quiz records found for student")
        
    # 3. Calculate avg score
    all_quizzes = db.query(QuizProgress).filter(QuizProgress.student_id == student.id).all()
    avg_score = sum(q.score for q in all_quizzes) / len(all_quizzes)
    
    completion_rate = 0.50 # Hardcoded completion rate proxy for MVP

    # 4. Trigger AI Recommender
    recommendation = recommend_learning_path(
        RecommendationRequest(
            student_id=student_id,
            subject=latest_quiz_record.subject,
            quiz_score=latest_quiz_record.score,
            completion_rate=completion_rate,
            weak_topics=[latest_quiz_record.subject],
        )
    )

    return DashboardResponse(
        student_id=student_id,
        name=student.name,
        progress=ProgressSummary(completion_rate=completion_rate, average_score=round(avg_score, 1), current_streak=3),
        latest_quiz=QuizSummary(
            subject=latest_quiz_record.subject, 
            score=latest_quiz_record.score, 
            submitted_at=latest_quiz_record.submitted_at.isoformat()
        ),
        recommendation=recommendation,
        learning_path=[
            f"Review {latest_quiz_record.subject}",
            "Latihan Soal Lanjutan",
            f"Evaluasi AI Tingkat {recommendation.difficulty.capitalize()}"
        ],
    )


@router.get("/teacher/overview", response_model=TeacherOverview)
def get_teacher_overview(db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))) -> TeacherOverview:
    total_students = db.query(Student).count()
    if total_students == 0:
        total_students = 32 # Dummy fallback
        
    return TeacherOverview(
        total_students=total_students,
        average_completion_rate=0.69,
        average_score=74.2,
        risk_topics=["Pecahan", "Persamaan Linear", "Statistika Dasar"],
        students_need_attention=["student-123", "student-014", "student-027"],
    )
