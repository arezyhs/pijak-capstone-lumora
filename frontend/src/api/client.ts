import axios from 'axios';
import type { DashboardResponse, TeacherOverview, QuizSubmission, QuizResult } from '../types';

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

export const submitQuiz = async (studentId: string, payload: QuizSubmission): Promise<QuizResult> => {
  const response = await apiClient.post<QuizResult>(`/students/${studentId}/submit_quiz`, payload);
  return response.data;
};
