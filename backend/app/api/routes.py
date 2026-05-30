from fastapi import APIRouter

from app.schemas.learning import (
    DashboardResponse,
    ProgressSummary,
    QuizSummary,
    RecommendationRequest,
    RecommendationResponse,
    TeacherOverview,
)
from app.services.recommender import recommend_learning_path

router = APIRouter()


@router.post("/recommendations", response_model=RecommendationResponse)
def create_recommendation(payload: RecommendationRequest) -> RecommendationResponse:
    return recommend_learning_path(payload)


@router.get("/students/{student_id}/dashboard", response_model=DashboardResponse)
def get_student_dashboard(student_id: str) -> DashboardResponse:
    recommendation = recommend_learning_path(
        RecommendationRequest(
            student_id=student_id,
            subject="Matematika",
            quiz_score=68,
            completion_rate=0.72,
            weak_topics=["Pecahan", "Persamaan Linear"],
        )
    )

    return DashboardResponse(
        student_id=student_id,
        name="Nadia Putri",
        progress=ProgressSummary(completion_rate=0.72, average_score=76.5, current_streak=5),
        latest_quiz=QuizSummary(subject="Matematika", score=68, submitted_at="2026-05-30T19:30:00+07:00"),
        recommendation=recommendation,
        learning_path=[
            "Review konsep pecahan",
            "Latihan persamaan linear",
            "Quiz adaptif tingkat remedial",
            "Evaluasi ulang rekomendasi",
        ],
    )


@router.get("/teacher/overview", response_model=TeacherOverview)
def get_teacher_overview() -> TeacherOverview:
    return TeacherOverview(
        total_students=32,
        average_completion_rate=0.69,
        average_score=74.2,
        risk_topics=["Pecahan", "Persamaan Linear", "Statistika Dasar"],
        students_need_attention=["student-001", "student-014", "student-027"],
    )
