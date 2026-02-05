import api from './api';
import { ENDPOINTS } from './endpoints';

export const courseService = {
  async getAll(params = {}) {
    const response = await api.get(ENDPOINTS.COURSES.BASE, { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(ENDPOINTS.COURSES.BY_ID(id));
    return response.data;
  },

  async create(data) {
    const response = await api.post(ENDPOINTS.COURSES.BASE, data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(ENDPOINTS.COURSES.BY_ID(id), data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(ENDPOINTS.COURSES.BY_ID(id));
    return response.data;
  },
};

export default courseService;
