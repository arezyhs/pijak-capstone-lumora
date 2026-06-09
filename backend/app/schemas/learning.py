from pydantic import BaseModel, Field


class Material(BaseModel):
    title: str
    type: str
    priority: int = Field(ge=1, le=5)


class RecommendationRequest(BaseModel):
    student_id: str
    subject: str
    quiz_score: float = Field(ge=0, le=100)
    completion_rate: float = Field(ge=0, le=1)
    weak_topics: list[str] = []


class RecommendationResponse(BaseModel):
    student_id: str
    difficulty: str
    recommended_topics: list[str]
    materials: list[Material]
    reason: str


class QuizSummary(BaseModel):
    subject: str
    score: float
    submitted_at: str


class ProgressSummary(BaseModel):
    completion_rate: float
    average_score: float
    current_streak: int


class DashboardResponse(BaseModel):
    student_id: str
    name: str
    progress: ProgressSummary
    latest_quiz: QuizSummary
    recommendation: RecommendationResponse
    learning_path: list[str]


class TeacherOverview(BaseModel):
    total_students: int
    average_completion_rate: float
    average_score: float
    risk_topics: list[str]
    students_need_attention: list[str]


class QuizSubmission(BaseModel):
    subject: str
    score: float = Field(ge=0, le=100)


class QuizResult(BaseModel):
    message: str
    quiz_score: float
    new_difficulty: str
