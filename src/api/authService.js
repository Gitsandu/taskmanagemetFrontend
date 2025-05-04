import axiosInstance from './axiosInstance';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(import.meta.env.VITE_USER_DATA_KEY, JSON.stringify({
          id: response.data._id,
          username: response.data.username,
          email: response.data.email
        }));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (username, email, password) => {
    try {
      const response = await axiosInstance.post('/auth/signup', { username, email, password });
      if (response.data.token) {
        localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, response.data.token);
        localStorage.setItem(import.meta.env.VITE_USER_DATA_KEY, JSON.stringify({
          id: response.data._id,
          username: response.data.username,
          email: response.data.email
        }));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    localStorage.removeItem(import.meta.env.VITE_USER_DATA_KEY);
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem(import.meta.env.VITE_USER_DATA_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
  }
};

export default authService;
