import axiosInstance from './axiosInstance';

const dashboardService = {
  // Get priority distribution data
  getPriorityDistribution: async () => {
    try {
      const response = await axiosInstance.get('/dashboard/priority-distribution');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get completion rate data with optional days parameter
  getCompletionRate: async (days = 7) => {
    try {
      const response = await axiosInstance.get(`/dashboard/completion-rate?days=${days}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get upcoming deadlines with optional days parameter
  getUpcomingDeadlines: async (days = 7) => {
    try {
      const response = await axiosInstance.get(`/dashboard/upcoming-deadlines?days=${days}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default dashboardService;
