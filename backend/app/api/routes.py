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
    QuizResult,
    UpdateProfileRequest,
    MaterialCompletionRequest
)
from app.services.recommender import recommend_learning_path
from app.models.student import Student, QuizProgress, MaterialProgress

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

@router.post("/students/{student_id}/complete_material")
def complete_material(student_id: str, payload: MaterialCompletionRequest, db: Session = Depends(get_db), current_user: User = Depends(require_role("student"))):
    student = seed_student_if_needed(db, student_id)
    
    # Check if already completed
    existing = db.query(MaterialProgress).filter(
        MaterialProgress.student_id == student.id,
        MaterialProgress.material_id == payload.material_id
    ).first()
    
    if not existing:
        progress = MaterialProgress(student_id=student.id, material_id=payload.material_id)
        db.add(progress)
        db.commit()
    
    return {"message": "Materi ditandai selesai"}

@router.post("/students/{student_id}/profile")
def update_student_profile(student_id: str, payload: UpdateProfileRequest, db: Session = Depends(get_db), current_user: User = Depends(require_role("student"))):
    student = seed_student_if_needed(db, student_id)
    student.sleep_hours = payload.sleep_hours
    student.stress_level = payload.stress_level
    student.age = payload.age
    student.gender = payload.gender
    student.internet_access = payload.internet_access
    student.family_income = payload.family_income
    student.parent_edu = payload.parent_edu
    student.extracurricular = payload.extracurricular
    
    db.commit()
    return {"message": "Profil berhasil diperbarui"}


@router.post("/students/{student_id}/submit_quiz", response_model=QuizResult)
def submit_quiz(student_id: str, payload: QuizSubmission, db: Session = Depends(get_db), current_user: User = Depends(require_role("student"))) -> QuizResult:
    student = seed_student_if_needed(db, student_id)
    
    # Save the new quiz
    new_quiz = QuizProgress(student_id=student.id, subject=payload.subject, score=payload.score)
    db.add(new_quiz)
    db.commit()
    
    # Calculate dynamic completion rate
    completed_materials_count = db.query(MaterialProgress).filter(MaterialProgress.student_id == student.id).count()
    completion_rate = min(1.0, completed_materials_count / 9.0) # Assume 9 total materials for MVP
    
    # Trigger AI recommender to get the new path difficulty
    recommendation = recommend_learning_path(
        RecommendationRequest(
            student_id=student_id,
            subject=payload.subject,
            quiz_score=payload.score,
            completion_rate=completion_rate,
            sleep_hours=student.sleep_hours,
            stress_level=student.stress_level,
            age=student.age,
            gender=student.gender,
            internet_access=student.internet_access,
            family_income=student.family_income,
            parent_edu=student.parent_edu,
            extracurricular=student.extracurricular,
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
    
    # Calculate dynamic completion rate
    completed_materials_count = db.query(MaterialProgress).filter(MaterialProgress.student_id == student.id).count()
    completion_rate = min(1.0, completed_materials_count / 9.0) # Assume 9 total materials for MVP

    # 4. Trigger AI Recommender
    recommendation = recommend_learning_path(
        RecommendationRequest(
            student_id=student_id,
            subject=latest_quiz_record.subject,
            quiz_score=avg_score,
            completion_rate=completion_rate,
            sleep_hours=student.sleep_hours,
            stress_level=student.stress_level,
            age=student.age,
            gender=student.gender,
            internet_access=student.internet_access,
            family_income=student.family_income,
            parent_edu=student.parent_edu,
            extracurricular=student.extracurricular,
            weak_topics=[latest_quiz_record.subject],
        )
    )

    # Create dynamic learning path based on recommendation difficulty
    path_steps = []
    if recommendation.difficulty == "Fast-Track Program":
        path_steps = ["Ambil Tantangan Ekstra", "Evaluasi Akhir Modul", "Sertifikasi Terselesaikan"]
    elif recommendation.difficulty == "Visual Learning Path":
        path_steps = ["Tonton Video Rangkuman", "Latihan Visual", "Ujian Ulang Visual"]
    elif recommendation.difficulty == "Microlearning Mode":
        path_steps = ["Manajemen Stres", "Microlearning 5 Menit", "Kuis Singkat Santai"]
    elif recommendation.difficulty == "Fundamental Level":
        path_steps = [f"Review Dasar {latest_quiz_record.subject}", "Latihan Terbimbing", "Evaluasi Ulang"]
    else:
        path_steps = [f"Pelajari Modul Inti {latest_quiz_record.subject}", "Latihan Mandiri", "Evaluasi Menengah"]

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
        learning_path=path_steps,
    )


@router.get("/teacher/overview", response_model=TeacherOverview)
def get_teacher_overview(db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))) -> TeacherOverview:
    students = db.query(Student).all()
    total_students = len(students)
    
    if total_students == 0:
        return TeacherOverview(
            total_students=0,
            average_completion_rate=0.0,
            average_score=0.0,
            risk_topics=[],
            students_need_attention=[]
        )
        
    all_quizzes = db.query(QuizProgress).all()
    avg_score = sum(q.score for q in all_quizzes) / len(all_quizzes) if all_quizzes else 0.0
    
    all_materials = db.query(MaterialProgress).count()
    avg_completion = min(1.0, (all_materials / (total_students * 9.0)))
    
    attention_students = []
    for s in students:
        s_quizzes = [q.score for q in all_quizzes if q.student_id == s.id]
        s_avg_score = sum(s_quizzes) / len(s_quizzes) if s_quizzes else 100
        if s.stress_level >= 8 or s_avg_score < 60:
            attention_students.append(f"{s.name} ({s.user_id}) - Stres: {s.stress_level}/10, Skor: {s_avg_score:.1f}")

    return TeacherOverview(
        total_students=total_students,
        average_completion_rate=avg_completion,
        average_score=avg_score,
        risk_topics=["Logika", "Matematika"], # Simplified for MVP
        students_need_attention=attention_students,
    )
