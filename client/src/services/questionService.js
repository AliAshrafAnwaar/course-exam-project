import api from './api';
import { ENDPOINTS } from './endpoints';

export const questionService = {
  async getAllByChapter(chapterId, params = {}) {
    const response = await api.get(ENDPOINTS.CHAPTERS.QUESTIONS(chapterId), { params });
    return response.data;
  },

  async getAllByCourse(courseId, params = {}) {
    const response = await api.get(ENDPOINTS.COURSES.QUESTIONS(courseId), { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(ENDPOINTS.QUESTIONS.BY_ID(id));
    return response.data;
  },

  async create(chapterId, data) {
    const response = await api.post(ENDPOINTS.CHAPTERS.QUESTIONS(chapterId), data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(ENDPOINTS.QUESTIONS.BY_ID(id), data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(ENDPOINTS.QUESTIONS.BY_ID(id));
    return response.data;
  },

  async getStats(chapterId) {
    const response = await api.get(ENDPOINTS.CHAPTERS.STATS(chapterId));
    return response.data;
  },
};

export default questionService;
