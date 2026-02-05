import api from './api';
import { ENDPOINTS } from './endpoints';

export const chapterService = {
  async getAllByCourse(courseId) {
    const response = await api.get(ENDPOINTS.COURSES.CHAPTERS(courseId));
    return response.data;
  },

  async getById(id) {
    const response = await api.get(ENDPOINTS.CHAPTERS.BY_ID(id));
    return response.data;
  },

  async create(courseId, data) {
    const response = await api.post(ENDPOINTS.COURSES.CHAPTERS(courseId), data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(ENDPOINTS.CHAPTERS.BY_ID(id), data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(ENDPOINTS.CHAPTERS.BY_ID(id));
    return response.data;
  },
};

export default chapterService;
