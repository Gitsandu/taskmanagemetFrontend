import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip, 
  Typography, 
  Divider, 
  Box,
  Button
} from '@mui/material';
import { 
  Today, 
  Flag, 
  ArrowForward 
} from '@mui/icons-material';
import { format, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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

const formatDueDate = (dateString) => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Today';
  } else if (isTomorrow(date)) {
    return 'Tomorrow';
  } else {
    return format(date, 'MMM d, yyyy');
  }
};

const UpcomingTasksList = ({ tasks }) => {
  const navigate = useNavigate();

  // If no tasks or empty array, show a message
  if (!tasks || tasks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No upcoming deadlines in the selected time range
        </Typography>
      </Box>
    );
  }

  const handleViewTask = (id) => {
    navigate(`/tasks/${id}`);
  };

  return (
    <List sx={{ width: '100%' }}>
      {tasks.map((task, index) => (
        <Box key={task._id}>
          <ListItem
            alignItems="flex-start"
            sx={{ pr: 9 }} // Add right padding to prevent content from overlapping with the button
            secondaryAction={
              <Button
                variant="text"
                color="primary"
                endIcon={<ArrowForward />}
                onClick={() => handleViewTask(task._id)}
                sx={{ position: 'absolute', right: 0 }}
              >
                View
              </Button>
            }
          >
            {/* <ListItemIcon>
              <Today color={isToday(new Date(task.dueDate)) ? "error" : "inherit"} />
            </ListItemIcon> */}
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{
                    fontWeight: isToday(new Date(task.dueDate)) ? 'bold' : 'normal',
                  }}
                >
                  {task.title}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5, pr: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {task.description?.length > 100
                      ? `${task.description.substring(0, 100)}...`
                      : task.description || 'No description'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                    <Chip
                      size="small"
                      icon={<Flag fontSize="small" />}
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                    />
                    <Chip
                      size="small"
                      icon={<Today fontSize="small" />}
                      label={formatDueDate(task.dueDate)}
                      color={isToday(new Date(task.dueDate)) ? "error" : "default"}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              }
            />
          </ListItem>
          {index < tasks.length - 1 && <Divider variant="inset" component="li" />}
        </Box>
      ))}
    </List>
  );
};

export default UpcomingTasksList;
