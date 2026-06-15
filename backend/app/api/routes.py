from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.models.student import Student, QuizProgress, MaterialProgress, DailyConditionLog
from app.models.user import User as UserModel
from app.api.auth import get_current_user, require_role, User, get_password_hash
from app.schemas.learning import (
    AdminStudentCreate,
    AdminStudentItem,
    AdminStudentUpdate,
    DashboardResponse,
    ProgressSummary,
    QuizSummary,
    RecommendationRequest,
    RecommendationResponse,
    TeacherOverview,
    QuizSubmission,
    QuizResult,
    UpdateProfileRequest,
    MaterialCompletionRequest,
    QuizHistoryItem,
    StudentHistoryResponse,
    ConditionHistoryItem,
)
from app.services.recommender import recommend_learning_path
from app.data.materials import get_total_material_count

router = APIRouter()

def seed_student_if_needed(db: Session, student_id: str):
    """Create a blank student profile if the user exists but has no profile yet."""
    student = db.query(Student).filter(Student.user_id == student_id).first()
    if not student:
        user = db.query(UserModel).filter(UserModel.username == student_id).first()
        actual_name = user.name if user and user.name else student_id
        student = Student(user_id=student_id, name=actual_name, department="General")
        db.add(student)
        db.commit()
        db.refresh(student)
    return student


def summarize_student(db: Session, student: Student) -> AdminStudentItem:
    quizzes = db.query(QuizProgress).filter(QuizProgress.student_id == student.id).all()
    materials_count = db.query(MaterialProgress).filter(MaterialProgress.student_id == student.id).count()
    scores = [quiz.score for quiz in quizzes]
    average_score = round(sum(scores) / len(scores), 1) if scores else 0.0
    completion_rate = min(1.0, materials_count / get_total_material_count())

    subject_scores: dict[str, list[float]] = {}
    for quiz in quizzes:
        subject_scores.setdefault(quiz.subject, []).append(quiz.score)
    weak_subjects = [
        subject
        for subject, values in sorted(
            subject_scores.items(),
            key=lambda item: sum(item[1]) / len(item[1])
        )
        if sum(values) / len(values) < 75
    ][:3]

    if student.stress_level >= 8 or (scores and average_score < 60):
        risk_level = "high"
    elif student.stress_level >= 7 or (scores and average_score < 75) or completion_rate < 0.25:
        risk_level = "medium"
    else:
        risk_level = "low"

    return AdminStudentItem(
        id=student.id,
        user_id=student.user_id,
        name=student.name,
        department=student.department,
        sleep_hours=student.sleep_hours,
        stress_level=student.stress_level,
        age=student.age,
        gender=student.gender,
        internet_access=student.internet_access,
        family_income=student.family_income,
        parent_edu=student.parent_edu,
        extracurricular=student.extracurricular,
        total_quizzes=len(quizzes),
        completed_materials=materials_count,
        average_score=average_score,
        completion_rate=completion_rate,
        risk_level=risk_level,
        weak_subjects=weak_subjects,
    )

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
    student.has_completed_onboarding = True
    
    # Log condition
    log = DailyConditionLog(student_id=student.id, sleep_hours=payload.sleep_hours, stress_level=payload.stress_level)
    db.add(log)
    
    db.commit()
    return {"message": "Profil berhasil diperbarui"}

from pydantic import BaseModel
class ConditionRequest(BaseModel):
    sleep_hours: float
    stress_level: int

@router.patch("/students/{student_id}/condition")
def update_student_condition(student_id: str, payload: ConditionRequest, db: Session = Depends(get_db), current_user: User = Depends(require_role("student"))):
    student = seed_student_if_needed(db, student_id)
    student.sleep_hours = payload.sleep_hours
    student.stress_level = payload.stress_level
    
    log = DailyConditionLog(student_id=student.id, sleep_hours=payload.sleep_hours, stress_level=payload.stress_level)
    db.add(log)
    
    db.commit()
    return {"message": "Kondisi harian berhasil diperbarui"}


@router.post("/students/{student_id}/submit_quiz", response_model=QuizResult)
def submit_quiz(student_id: str, payload: QuizSubmission, db: Session = Depends(get_db), current_user: User = Depends(require_role("student"))) -> QuizResult:
    student = seed_student_if_needed(db, student_id)
    
    # Save the new quiz
    new_quiz = QuizProgress(student_id=student.id, subject=payload.subject, score=payload.score)
    db.add(new_quiz)
    db.commit()
    
    # Calculate dynamic completion rate
    completed_materials_count = db.query(MaterialProgress).filter(MaterialProgress.student_id == student.id).count()
    completion_rate = min(1.0, completed_materials_count / get_total_material_count())
    
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

    # 3. Calculate avg score and weakest subjects
    all_quizzes = db.query(QuizProgress).filter(QuizProgress.student_id == student.id).all()
    avg_score = sum(q.score for q in all_quizzes) / len(all_quizzes) if all_quizzes else 0.0
    subject_scores: dict[str, list[float]] = {}
    for quiz in all_quizzes:
        subject_scores.setdefault(quiz.subject, []).append(quiz.score)
    score_by_subject = {
        subject: sum(scores) / len(scores)
        for subject, scores in subject_scores.items()
    }
    ranked_subjects = sorted(score_by_subject.items(), key=lambda item: item[1])
    target_subject = ranked_subjects[0][0] if ranked_subjects else "Matematika"
    weak_topics = [
        subject
        for subject, score in ranked_subjects
        if score < 75
    ][:3] or [target_subject]
    
    # Calculate dynamic completion rate
    completed_materials_count = db.query(MaterialProgress).filter(MaterialProgress.student_id == student.id).count()
    completion_rate = min(1.0, completed_materials_count / get_total_material_count())

    # 4. Trigger AI Recommender
    recommendation = recommend_learning_path(
        RecommendationRequest(
            student_id=student_id,
            subject=target_subject,
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
            weak_topics=weak_topics,
        )
    )

    # Create dynamic learning path based on recommendation difficulty
    path_steps = []
    if not latest_quiz_record:
        path_steps = ["Pilih Materi Pertama", "Kerjakan Kuis Diagnostik", "Lihat Rekomendasi AI"]
    elif recommendation.difficulty == "Fast-Track Program":
        path_steps = ["Ambil Tantangan Ekstra", "Evaluasi Akhir Modul", "Sertifikasi Terselesaikan"]
    elif recommendation.difficulty == "Visual Learning Path":
        path_steps = ["Tonton Video Rangkuman", "Latihan Visual", "Ujian Ulang Visual"]
    elif recommendation.difficulty == "Microlearning Mode":
        path_steps = ["Manajemen Stres", "Microlearning 5 Menit", "Kuis Singkat Santai"]
    elif recommendation.difficulty == "Fundamental Level":
        path_steps = [f"Review Dasar {target_subject}", "Latihan Terbimbing", "Evaluasi Ulang"]
    else:
        path_steps = [f"Pelajari Modul Inti {target_subject}", "Latihan Mandiri", "Evaluasi Menengah"]

    return DashboardResponse(
        student_id=student_id,
        name=student.name,
        progress=ProgressSummary(completion_rate=completion_rate, average_score=round(avg_score, 1), current_streak=3),
        latest_quiz=QuizSummary(
            subject=latest_quiz_record.subject if latest_quiz_record else "Belum ada kuis",
            score=latest_quiz_record.score if latest_quiz_record else 0.0,
            submitted_at=latest_quiz_record.submitted_at.isoformat() if latest_quiz_record else "",
        ),
        recommendation=recommendation,
        learning_path=path_steps,
    )


@router.get("/students/{student_id}/history", response_model=StudentHistoryResponse)
def get_student_history(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student"))
) -> StudentHistoryResponse:
    student = seed_student_if_needed(db, student_id)
    all_quizzes = db.query(QuizProgress).filter(
        QuizProgress.student_id == student.id
    ).order_by(QuizProgress.submitted_at.desc()).all()

    if not all_quizzes:
        return StudentHistoryResponse(
            student_id=student_id,
            name=student.name,
            quiz_history=[],
            condition_history=[],
            total_quizzes=0,
            average_score=0.0,
            highest_score=0.0,
            lowest_score=0.0,
            score_by_subject={},
        )

    scores = [q.score for q in all_quizzes]
    avg_score = sum(scores) / len(scores)
    highest = max(scores)
    lowest = min(scores)

    # Group by subject -> average per subject
    subject_scores: dict[str, list[float]] = {}
    for q in all_quizzes:
        subject_scores.setdefault(q.subject, []).append(q.score)
    score_by_subject = {subj: round(sum(v) / len(v), 1) for subj, v in subject_scores.items()}

    condition_logs = db.query(DailyConditionLog).filter(
        DailyConditionLog.student_id == student.id
    ).order_by(DailyConditionLog.logged_at.asc()).all()

    return StudentHistoryResponse(
        student_id=student_id,
        name=student.name,
        quiz_history=[
            QuizHistoryItem(
                id=q.id,
                subject=q.subject,
                score=q.score,
                submitted_at=q.submitted_at.isoformat(),
            )
            for q in all_quizzes
        ],
        condition_history=[
            ConditionHistoryItem(
                id=c.id,
                sleep_hours=c.sleep_hours,
                stress_level=c.stress_level,
                logged_at=c.logged_at.isoformat(),
            )
            for c in condition_logs
        ],
        total_quizzes=len(all_quizzes),
        average_score=round(avg_score, 1),
        highest_score=highest,
        lowest_score=lowest,
        score_by_subject=score_by_subject,
    )


@router.get("/teacher/overview", response_model=TeacherOverview)
def get_teacher_overview(db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))) -> TeacherOverview:
    students = db.query(Student).all()
    total_students = len(students)
    student_items = [summarize_student(db, student) for student in students]
    
    if total_students == 0:
        return TeacherOverview(
            total_students=0,
            average_completion_rate=0.0,
            average_score=0.0,
            risk_topics=[],
            students_need_attention=[],
            students=[],
        )
        
    all_quizzes = db.query(QuizProgress).all()
    avg_score = sum(q.score for q in all_quizzes) / len(all_quizzes) if all_quizzes else 0.0
    
    all_materials = db.query(MaterialProgress).count()
    avg_completion = min(1.0, (all_materials / (total_students * get_total_material_count())))
    
    attention_students = [
        f"{student.name} ({student.user_id}) - Risiko: {student.risk_level}, Skor: {student.average_score:.1f}, Stres: {student.stress_level}/10"
        for student in student_items
        if student.risk_level == "high"
    ]
    risk_topics = sorted({
        subject
        for student in student_items
        for subject in student.weak_subjects
    })

    return TeacherOverview(
        total_students=total_students,
        average_completion_rate=avg_completion,
        average_score=round(avg_score, 1),
        risk_topics=risk_topics,
        students_need_attention=attention_students,
        students=student_items,
    )


@router.get("/admin/students", response_model=list[AdminStudentItem])
def list_admin_students(db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))) -> list[AdminStudentItem]:
    students = db.query(Student).order_by(Student.name.asc()).all()
    return [summarize_student(db, student) for student in students]


@router.post("/admin/students", response_model=AdminStudentItem)
def create_admin_student(payload: AdminStudentCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))) -> AdminStudentItem:
    existing_student = db.query(Student).filter(Student.user_id == payload.user_id).first()
    if existing_student:
        raise HTTPException(status_code=409, detail="Student user_id already exists")

    existing_user = db.query(UserModel).filter(UserModel.username == payload.user_id).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")

    user = UserModel(username=payload.user_id, name=payload.name, hashed_password=get_password_hash(payload.password), role="student")
    student = Student(
        user_id=payload.user_id,
        name=payload.name,
        department=payload.department,
        sleep_hours=payload.sleep_hours,
        stress_level=payload.stress_level,
        age=payload.age,
        gender=payload.gender,
        internet_access=payload.internet_access,
        family_income=payload.family_income,
        parent_edu=payload.parent_edu,
        extracurricular=payload.extracurricular,
    )
    db.add(user)
    db.add(student)
    db.commit()
    db.refresh(student)
    return summarize_student(db, student)


@router.put("/admin/students/{student_id}", response_model=AdminStudentItem)
def update_admin_student(student_id: int, payload: AdminStudentUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))) -> AdminStudentItem:
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    user = db.query(UserModel).filter(UserModel.username == student.user_id).first()
    if payload.user_id and payload.user_id != student.user_id:
        if db.query(Student).filter(Student.user_id == payload.user_id).first() or db.query(UserModel).filter(UserModel.username == payload.user_id).first():
            raise HTTPException(status_code=409, detail="New user_id already exists")
        if user:
            user.username = payload.user_id
        student.user_id = payload.user_id

    for field in [
        "name",
        "department",
        "sleep_hours",
        "stress_level",
        "age",
        "gender",
        "internet_access",
        "family_income",
        "parent_edu",
        "extracurricular",
    ]:
        value = getattr(payload, field)
        if value is not None:
            setattr(student, field, value)

    if payload.password and user:
        user.hashed_password = get_password_hash(payload.password)

    db.commit()
    db.refresh(student)
    return summarize_student(db, student)


@router.delete("/admin/students/{student_id}")
def delete_admin_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    user = db.query(UserModel).filter(UserModel.username == student.user_id, UserModel.role == "student").first()
    db.delete(student)
    if user:
        db.delete(user)
    db.commit()
    return {"message": "Siswa dan akun login terkait berhasil dihapus"}


@router.delete("/admin/reset-learning")
def reset_learning_data(db: Session = Depends(get_db), current_user: User = Depends(require_role("teacher"))):
    db.query(MaterialProgress).delete()
    db.query(QuizProgress).delete()
    db.query(Student).delete()
    db.query(UserModel).filter(UserModel.role == "student").delete()
    db.commit()
    return {"message": "Database belajar direset. Akun guru tetap dipertahankan."}
