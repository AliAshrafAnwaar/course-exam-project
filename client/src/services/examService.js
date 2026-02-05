import api from './api';
import { ENDPOINTS } from './endpoints';

export const examService = {
  async getAllByCourse(courseId, params = {}) {
    const response = await api.get(ENDPOINTS.COURSES.EXAMS(courseId), { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(ENDPOINTS.EXAMS.BY_ID(id));
    return response.data;
  },

  async create(courseId, data) {
    const response = await api.post(ENDPOINTS.COURSES.EXAMS(courseId), data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(ENDPOINTS.EXAMS.BY_ID(id));
    return response.data;
  },

  async generate(examId, options = {}) {
    const response = await api.post(ENDPOINTS.EXAMS.GENERATE(examId), { options });
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(ENDPOINTS.EXAMS.BY_ID(id), data);
    return response.data;
  },

  async setQuestions(examId, questionIds) {
    const response = await api.post(`${ENDPOINTS.EXAMS.BY_ID(examId)}/questions`, { questionIds });
    return response.data;
  },
};

export default examService;
