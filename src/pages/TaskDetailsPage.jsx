import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  ArrowBack, 
  CalendarToday, 
  Flag, 
  Edit, 
  Delete,
  CheckCircle,
  RestoreFromTrash,
  MoreVert
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import taskService from '../api/taskService';
import MainLayout from '../components/layout/MainLayout';
import TaskForm from '../components/forms/TaskForm';
import useApi from '../hooks/useApi';
import DeleteConfirmationDialog from '../components/common/DeleteConfirmationDialog';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const TaskDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [task, setTask] = useState(null);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  
  const { loading, execute: fetchTask } = useApi(taskService.getTaskById);

  useEffect(() => {
    loadTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTask = async () => {
    try {
      const data = await fetchTask(id);
      setTask(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task details');
      console.error('Error fetching task:', err);
    }
  };

  const handleEditTask = () => {
    setOpenTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setOpenTaskForm(false);
  };

  const handleTaskFormSubmit = async (taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      setOpenTaskForm(false);
      loadTask();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await taskService.deleteTask(id);
      setDeleteDialogOpen(false);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      setDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await taskService.updateTask(id, { status: newStatus });
      loadTask();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to mark task as ${newStatus}`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuEdit = () => {
    handleMenuClose();
    handleEditTask();
  };

  const handleMenuDelete = () => {
    handleMenuClose();
    handleDeleteClick();
  };

  if (loading) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Alert severity="error" sx={{ my: 4 }}>
            {error}
          </Alert>
          {isMobile ? (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              fullWidth
            >
              Back to Tasks
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Back to Tasks
              </Button>
            </Box>
          )}
        </Container>
      </MainLayout>
    );
  }

  if (!task) {
    return (
      <MainLayout>
        <Container maxWidth="md">
          <Alert severity="info" sx={{ my: 4 }}>
            Task not found
          </Alert>
          {isMobile ? (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              fullWidth
            >
              Back to Tasks
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
              >
                Back to Tasks
              </Button>
            </Box>
          )}
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {isMobile ? (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              fullWidth
              sx={{ mb: 3 }}
            >
              Back to Tasks
            </Button>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBack}
                sx={{ mb: 3 }}
              >
                Back to Tasks
              </Button>
            </Box>
          )}

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </Typography>
              
              <Box>
                {isMobile ? (
                  <>
                    <IconButton
                      aria-label="more options"
                      aria-controls="task-menu"
                      aria-haspopup="true"
                      onClick={handleMenuOpen}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      id="task-menu"
                      anchorEl={menuAnchorEl}
                      keepMounted
                      open={Boolean(menuAnchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuEdit}>
                        <ListItemIcon>
                          <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Edit" />
                      </MenuItem>
                      <MenuItem onClick={handleMenuDelete}>
                        <ListItemIcon>
                          <Delete fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Delete" sx={{ color: 'error.main' }} />
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEditTask}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleDeleteClick}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Chip 
                icon={<Flag />} 
                label={task.priority} 
                color={getPriorityColor(task.priority)} 
              />
              
              <Chip 
                icon={<CalendarToday />} 
                label={task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'} 
                variant="outlined"
              />
              
              <Chip 
                label={task.status} 
                color={task.status === 'Completed' ? 'success' : 'default'} 
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" paragraph>
                  {task.description || 'No description provided'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Created: {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Last Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a')}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {task.status === 'Pending' ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => handleStatusChange('Completed')}
                >
                  Mark as Completed
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<RestoreFromTrash />}
                  onClick={() => handleStatusChange('Pending')}
                >
                  Mark as Pending
                </Button>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Task Form Dialog */}
        <TaskForm
          open={openTaskForm}
          onClose={handleTaskFormClose}
          onSubmit={handleTaskFormSubmit}
          task={task}
        />

        {/* Delete confirmation dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          itemName={task?.title}
          itemType="task"
        />
      </Container>
    </MainLayout>
  );
};

export default TaskDetailsPage;
