from pydantic import BaseModel, Field
from typing import Optional


class Material(BaseModel):
    title: str
    type: str
    priority: int = Field(ge=0, le=5)
    tags: list[str] = Field(default_factory=list)


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
    weak_topics: list[str] = Field(default_factory=list)

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
    model_used: bool = False
    confidence: float = Field(default=0.0, ge=0, le=1)
    recommended_topics: list[str]
    recommended_tags: list[str] = Field(default_factory=list)
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


class AdminStudentItem(BaseModel):
    id: int
    user_id: str
    name: str
    department: str
    sleep_hours: float
    stress_level: int
    age: int
    gender: str
    internet_access: str
    family_income: str
    parent_edu: str
    extracurricular: str
    total_quizzes: int
    completed_materials: int
    average_score: float
    completion_rate: float
    risk_level: str
    weak_subjects: list[str] = Field(default_factory=list)


class AdminStudentCreate(BaseModel):
    user_id: str
    name: str
    department: str = "General"
    password: str = "password123"
    sleep_hours: float = Field(default=7.0, ge=0, le=24)
    stress_level: int = Field(default=5, ge=1, le=10)
    age: int = Field(default=20, ge=10, le=60)
    gender: str = "Female"
    internet_access: str = "Yes"
    family_income: str = "Medium"
    parent_edu: str = "High School"
    extracurricular: str = "No"


class AdminStudentUpdate(BaseModel):
    user_id: str | None = None
    name: str | None = None
    department: str | None = None
    password: str | None = None
    sleep_hours: float | None = Field(default=None, ge=0, le=24)
    stress_level: int | None = Field(default=None, ge=1, le=10)
    age: int | None = Field(default=None, ge=10, le=60)
    gender: str | None = None
    internet_access: str | None = None
    family_income: str | None = None
    parent_edu: str | None = None
    extracurricular: str | None = None


class TeacherOverview(BaseModel):
    total_students: int
    average_completion_rate: float
    average_score: float
    risk_topics: list[str]
    students_need_attention: list[str]
    students: list[AdminStudentItem] = Field(default_factory=list)


class QuizSubmission(BaseModel):
    subject: str
    score: float = Field(ge=0, le=100)


class QuizResult(BaseModel):
    message: str
    quiz_score: float
    new_difficulty: str


class QuizHistoryItem(BaseModel):
    id: int
    subject: str
    score: float
    submitted_at: str


class StudentHistoryResponse(BaseModel):
    student_id: str
    name: str
    quiz_history: list[QuizHistoryItem]
    total_quizzes: int
    average_score: float
    highest_score: float
    lowest_score: float
    score_by_subject: dict[str, float]  # subject -> avg score per subject
