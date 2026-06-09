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
    sleep_hours: float = 7.0
    stress_level: int = 5
    age: int = 20
    gender: str = "Female"
    internet_access: str = "Yes"
    family_income: str = "Medium"
    parent_edu: str = "High School"
    extracurricular: str = "No"
    weak_topics: list[str] = []

class MaterialCompletionRequest(BaseModel):
    material_id: str


class UpdateProfileRequest(BaseModel):
    sleep_hours: float = Field(ge=0, le=24)
    stress_level: int = Field(ge=1, le=10)
    age: int = Field(ge=10, le=60)
    gender: str
    internet_access: str
    family_income: str
    parent_edu: str
    extracurricular: str


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
