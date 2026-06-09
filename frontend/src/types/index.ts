export interface Material {
  title: string;
  type: string;
  priority: number;
}

export interface RecommendationResponse {
  student_id: string;
  difficulty: string;
  recommended_topics: string[];
  materials: Material[];
  reason: string;
}

export interface QuizSummary {
  subject: string;
  score: number;
  submitted_at: string;
}

export interface ProgressSummary {
  completion_rate: number;
  average_score: number;
  current_streak: number;
}

export interface DashboardResponse {
  student_id: string;
  name: string;
  progress: ProgressSummary;
  latest_quiz: QuizSummary;
  recommendation: RecommendationResponse;
  learning_path: string[];
}

export interface TeacherOverview {
  total_students: number;
  average_completion_rate: number;
  average_score: number;
  risk_topics: string[];
  students_need_attention: string[];
}

export interface QuizSubmission {
  subject: string;
  score: number;
}

export interface QuizResult {
  message: string;
  quiz_score: number;
  new_difficulty: string;
}
