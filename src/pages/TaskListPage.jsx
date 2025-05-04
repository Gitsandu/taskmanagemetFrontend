import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  TextField, 
  InputAdornment,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Stack
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import taskService from '../api/taskService';
import MainLayout from '../components/layout/MainLayout';
import TaskItem from '../features/tasks/TaskItem';
import TaskForm from '../components/forms/TaskForm';
import useApi from '../hooks/useApi';

const TaskListPage = () => {
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    dueDate: searchParams.get('dueDate') || '',
    sortBy: searchParams.get('sortBy') || 'dueDate:asc',
    search: searchParams.get('search') || '',
  });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const { loading, error, execute: fetchTasks } = useApi(taskService.getTasks);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const dueDate = searchParams.get('dueDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy');
    
    let newFilters = { ...filters };
    
    if (status) {
      newFilters.status = status;
    } else {
      newFilters.status = '';
    }
    
    if (priority) {
      newFilters.priority = priority;
    } else {
      newFilters.priority = '';
    }
    
    if (dueDate) {
      newFilters.dueDate = dueDate;
    } else {
      newFilters.dueDate = '';
    }

    if (search) {
      newFilters.search = search;
    }

    if (sortBy) {
      newFilters.sortBy = sortBy;
    }
    
    setFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks(filters);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setOpenTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setOpenTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setOpenTaskForm(false);
    setEditingTask(null);
  };

  const handleTaskFormSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        setNotification({
          open: true,
          message: 'Task updated successfully',
          severity: 'success'
        });
      } else {
        await taskService.createTask(taskData);
        setNotification({
          open: true,
          message: 'Task created successfully',
          severity: 'success'
        });
      }
      handleTaskFormClose();
      loadTasks();
    } catch (err) {
      setNotification({
        open: true,
        message: `Error: ${err.response?.data?.message || 'Something went wrong'}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setNotification({
        open: true,
        message: 'Task deleted successfully',
        severity: 'success'
      });
      loadTasks();
    } catch (err) {
      setNotification({
        open: true,
        message: `Error: ${err.response?.data?.message || 'Something went wrong'}`,
        severity: 'error'
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await taskService.updateTask(id, { status: newStatus });
      setNotification({
        open: true,
        message: `Task marked as ${newStatus}`,
        severity: 'success'
      });
      loadTasks();
    } catch (err) {
      setNotification({
        open: true,
        message: `Error: ${err.response?.data?.message || 'Something went wrong'}`,
        severity: 'error'
      });
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (event) => {
    setFilters(prev => ({ ...prev, search: event.target.value }));
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <MainLayout>
      <Box sx={{ width: '100%', p: 0 }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
          <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              gap: 2,
              mb: 3 
            }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: { xs: 1, sm: 'auto' } }}>
              Tasks
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleCreateTask}
              sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' },
                width: { xs: '100%', sm: '10%' },
                minWidth: { xs: '100%', sm: '200px' }
              }}
            >
              Create Task
            </Button>
          </Box>

          {/* Filters and Search */}
          <Box sx={{ mb: 4, width: '100%' }}>
            
            {/* Filter controls in a row */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>

            <TextField
                fullWidth
                placeholder="Search tasks..."
                value={filters.search}
                onChange={handleSearchChange}
                sx={{ 
                  width: { xs: '100%', sm: '50%' },
                  minWidth: { xs: '100%', sm: '200px' }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Status Dropdown */}
              <FormControl 
                variant="outlined" 
                size="medium" 
                sx={{ 
                  width: { xs: '100%', sm: '25%' },
                  minWidth: { xs: '100%', sm: '200px' }
                }}
              >
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
              
              {/* Sort By Dropdown */}
              <FormControl 
                variant="outlined" 
                size="medium" 
                sx={{ 
                  width: { xs: '100%', sm: '25%' },
                  minWidth: { xs: '100%', sm: '200px' }
                }}
              >
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  name="sortBy"
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="dueDate:asc">Due Date (Earliest)</MenuItem>
                  <MenuItem value="dueDate:desc">Due Date (Latest)</MenuItem>
                  <MenuItem value="priority:desc">Priority (High to Low)</MenuItem>
                  <MenuItem value="priority:asc">Priority (Low to High)</MenuItem>
                  <MenuItem value="createdAt:desc">Recently Created</MenuItem>
                  <MenuItem value="createdAt:asc">Oldest Created</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Task list */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : tasks.length > 0 ? (
            <Grid container spacing={2} sx={{ width: '100%', mx: 0, px: { xs: 2, sm: 0 } }}>
              {tasks.map((task) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={task._id}>
                  <TaskItem
                    task={task}
                    onEdit={() => handleEditTask(task)}
                    onDelete={() => handleDeleteTask(task._id)}
                    onStatusChange={(newStatus) => handleStatusChange(task._id, newStatus)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No tasks found. Create your first task!
              </Typography>
            </Box>
          )}
        </Box>

        {/* Task Form Dialog */}
        <TaskForm
          open={openTaskForm}
          onClose={handleTaskFormClose}
          onSubmit={handleTaskFormSubmit}
          task={editingTask}
        />

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </MainLayout>
  );
};

export default TaskListPage;
