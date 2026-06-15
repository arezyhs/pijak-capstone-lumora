import axios from 'axios';
import type { AdminStudentItem, AdminStudentPayload, DashboardResponse, TeacherOverview, QuizSubmission, QuizResult, StudentHistoryResponse } from '../types';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginApi = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  
  const response = await axios.post('http://localhost:8000/api/v1/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  return response.data;
};

export const fetchStudentDashboard = async (studentId: string): Promise<DashboardResponse> => {
  const response = await apiClient.get<DashboardResponse>(`/students/${studentId}/dashboard`);
  return response.data;
};

export const fetchTeacherOverview = async (): Promise<TeacherOverview> => {
  const response = await apiClient.get<TeacherOverview>('/teacher/overview');
  return response.data;
};

export const fetchAdminStudents = async (): Promise<AdminStudentItem[]> => {
  const response = await apiClient.get<AdminStudentItem[]>('/admin/students');
  return response.data;
};

export const createAdminStudent = async (payload: AdminStudentPayload): Promise<AdminStudentItem> => {
  const response = await apiClient.post<AdminStudentItem>('/admin/students', payload);
  return response.data;
};

export const updateAdminStudent = async (studentId: number, payload: Partial<AdminStudentPayload>): Promise<AdminStudentItem> => {
  const response = await apiClient.put<AdminStudentItem>(`/admin/students/${studentId}`, payload);
  return response.data;
};

export const deleteAdminStudent = async (studentId: number) => {
  const response = await apiClient.delete(`/admin/students/${studentId}`);
  return response.data;
};

export const resetLearningData = async () => {
  const response = await apiClient.delete('/admin/reset-learning');
  return response.data;
};

export const submitQuiz = async (studentId: string, payload: QuizSubmission): Promise<QuizResult> => {
  const response = await apiClient.post<QuizResult>(`/students/${studentId}/submit_quiz`, payload);
  return response.data;
};

export const updateStudentProfile = async (
  username: string, 
  sleepHours: number, 
  stressLevel: number,
  age: number = 20,
  gender: string = "Female",
  internetAccess: string = "Yes",
  familyIncome: string = "Medium",
  parentEdu: string = "High School",
  extracurricular: string = "No"
) => {
  const token = localStorage.getItem('token')
  const response = await axios.post(
    `http://localhost:8000/api/v1/students/${username}/profile`,
    { 
      sleep_hours: sleepHours, 
      stress_level: stressLevel,
      age: age,
      gender: gender,
      internet_access: internetAccess,
      family_income: familyIncome,
      parent_edu: parentEdu,
      extracurricular: extracurricular
    },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
};

export const completeMaterial = async (studentId: string, materialId: string) => {
  const response = await apiClient.post(`/students/${studentId}/complete_material`, { material_id: materialId });
  return response.data;
};

export const fetchMaterials = async () => {
  const response = await apiClient.get('/content/materials');
  return response.data;
};

export const fetchQuizzes = async () => {
  const response = await apiClient.get('/content/quizzes');
  return response.data;
};

export const fetchStudentHistory = async (studentId: string): Promise<StudentHistoryResponse> => {
  const response = await apiClient.get<StudentHistoryResponse>(`/students/${studentId}/history`);
  return response.data;
};
