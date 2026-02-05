import api from './api';
import { ENDPOINTS } from './endpoints';

export const authService = {
  async register(userData) {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    if (response.data.success) {
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  async getProfile() {
    const response = await api.get(ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};

export default authService;
