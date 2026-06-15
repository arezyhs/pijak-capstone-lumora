export interface Material {
  title: string;
  type: string;
  priority: number;
  tags: string[];
}

export interface RecommendationResponse {
  student_id: string;
  difficulty: string;
  model_used: boolean;
  confidence: number;
  recommended_topics: string[];
  recommended_tags: string[];
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
  students: AdminStudentItem[];
}

export interface AdminStudentItem {
  id: number;
  user_id: string;
  name: string;
  department: string;
  sleep_hours: number;
  stress_level: number;
  age: number;
  gender: string;
  internet_access: string;
  family_income: string;
  parent_edu: string;
  extracurricular: string;
  total_quizzes: number;
  completed_materials: number;
  average_score: number;
  completion_rate: number;
  risk_level: 'low' | 'medium' | 'high';
  weak_subjects: string[];
}

export interface AdminStudentPayload {
  user_id: string;
  name: string;
  department: string;
  password?: string;
  sleep_hours: number;
  stress_level: number;
  age: number;
  gender: string;
  internet_access: string;
  family_income: string;
  parent_edu: string;
  extracurricular: string;
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

export interface QuizHistoryItem {
  id: number;
  subject: string;
  score: number;
  submitted_at: string;
}

export interface StudentHistoryResponse {
  student_id: string;
  name: string;
  quiz_history: QuizHistoryItem[];
  total_quizzes: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  score_by_subject: Record<string, number>;
}
