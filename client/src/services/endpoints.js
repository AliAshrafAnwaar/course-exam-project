const API_BASE = '/api/v1';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE}/auth/register`,
    LOGIN: `${API_BASE}/auth/login`,
    PROFILE: `${API_BASE}/auth/profile`,
    UPDATE_PROFILE: `${API_BASE}/auth/profile`,
    CHANGE_PASSWORD: `${API_BASE}/auth/password`,
  },
  COURSES: {
    BASE: `${API_BASE}/courses`,
    BY_ID: (id) => `${API_BASE}/courses/${id}`,
    CHAPTERS: (courseId) => `${API_BASE}/courses/${courseId}/chapters`,
    EXAMS: (courseId) => `${API_BASE}/courses/${courseId}/exams`,
    QUESTIONS: (courseId) => `${API_BASE}/courses/${courseId}/questions`,
  },
  CHAPTERS: {
    BASE: `${API_BASE}/chapters`,
    BY_ID: (id) => `${API_BASE}/chapters/${id}`,
    QUESTIONS: (chapterId) => `${API_BASE}/chapters/${chapterId}/questions`,
    STATS: (chapterId) => `${API_BASE}/chapters/${chapterId}/questions/stats`,
  },
  QUESTIONS: {
    BASE: `${API_BASE}/questions`,
    BY_ID: (id) => `${API_BASE}/questions/${id}`,
  },
  EXAMS: {
    BASE: `${API_BASE}/exams`,
    BY_ID: (id) => `${API_BASE}/exams/${id}`,
    GENERATE: (id) => `${API_BASE}/exams/${id}/generate`,
  },
};

export default ENDPOINTS;
