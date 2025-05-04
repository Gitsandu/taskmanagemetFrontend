import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  CheckCircle, 
  RestoreFromTrash,
  CalendarToday,
  Flag
} from '@mui/icons-material';
import { useState, Fragment } from 'react';
import DeleteConfirmationDialog from '../../components/common/DeleteConfirmationDialog';
import { format } from 'date-fns';

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

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const open = Boolean(anchorEl);
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    handleCloseMenu();
    onEdit();
  };
  
  const handleDeleteClick = () => {
    handleCloseMenu();
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    onDelete();
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleStatusChange = (newStatus) => {
    handleCloseMenu();
    onStatusChange(newStatus);
  };

  return (
    <Fragment>
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 2,
          borderLeft: 6,
          borderColor: task.status === 'Completed' ? 'success.main' : getPriorityColor(task.priority) + '.main',
          opacity: task.status === 'Completed' ? 0.8 : 1,
          transition: 'all 0.3s ease'
        }}
      >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                mb: 1
              }}
            >
              {task.title}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 2 }}
            >
              {task.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                icon={<Flag />} 
                label={task.priority} 
                size="small" 
                color={getPriorityColor(task.priority)} 
              />
              
              <Chip 
                icon={<CalendarToday />} 
                label={task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'} 
                size="small" 
                variant="outlined"
              />
              
              <Chip 
                label={task.status} 
                size="small" 
                color={task.status === 'Completed' ? 'success' : 'default'} 
                variant="outlined"
              />
            </Box>
          </Box>
          
          <IconButton 
            aria-label="task options" 
            aria-controls={open ? 'task-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleOpenMenu}
          >
            <MoreVert />
          </IconButton>
          
          <Menu
            id="task-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            MenuListProps={{
              'aria-labelledby': 'task-options-button',
            }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            
            {task.status === 'Pending' ? (
              <MenuItem onClick={() => handleStatusChange('Completed')}>
                <ListItemIcon>
                  <CheckCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>Mark as Completed</ListItemText>
              </MenuItem>
            ) : (
              <MenuItem onClick={() => handleStatusChange('Pending')}>
                <ListItemIcon>
                  <RestoreFromTrash fontSize="small" />
                </ListItemIcon>
                <ListItemText>Mark as Pending</ListItemText>
              </MenuItem>
            )}
            
            <Divider />
            
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Delete fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </CardContent>
    </Card>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={task.title}
        itemType="task"
      />
    </Fragment>
  );
};

export default TaskItem;
