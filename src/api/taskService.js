import axiosInstance from './axiosInstance';

const taskService = {
  // Get all tasks with optional filtering, sorting, and search
  getTasks: async (filters = {}) => {
    try {
      const { status, sortBy, search, priority, dueDate } = filters;
      let url = '/tasks';
      
      // Build query parameters
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);
      if (sortBy) params.append('sortBy', sortBy);
      if (search) params.append('search', search);
      if (dueDate) params.append('dueDate', dueDate);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      const response = await axiosInstance.get(url);
      
      // Apply client-side filtering for better accuracy
      let data = response.data;
      
      // Exact priority matching
      if (priority && Array.isArray(data)) {
        data = data.filter(task => task.priority === priority);
      }
      
      // Handle 'today' filter if the backend doesn't support it properly
      if (dueDate === 'today' && Array.isArray(data)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow
        
        data = data.filter(task => {
          if (!task.dueDate) return false;
          
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0); // Normalize time part
          
          return taskDate.getTime() === today.getTime();
        });
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get a task by ID
  getTaskById: async (id) => {
    try {
      const response = await axiosInstance.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await axiosInstance.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing task
  updateTask: async (id, taskData) => {
    try {
      const response = await axiosInstance.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default taskService;
