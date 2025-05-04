import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import PriorityChart from '../features/dashboard/PriorityChart';
import CompletionRateChart from '../features/dashboard/CompletionRateChart';
import UpcomingTasksList from '../features/dashboard/UpcomingTasksList';
import dashboardService from '../api/dashboardService';
import useApi from '../hooks/useApi';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState(7);
  const [priorityData, setPriorityData] = useState([]);
  const [completionData, setCompletionData] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  
  const { loading: loadingPriority, error: priorityError, execute: fetchPriorityData } = useApi(dashboardService.getPriorityDistribution);
  const { loading: loadingCompletion, error: completionError, execute: fetchCompletionRate } = useApi(dashboardService.getCompletionRate);
  const { loading: loadingUpcoming, error: upcomingError, execute: fetchUpcomingDeadlines } = useApi(dashboardService.getUpcomingDeadlines);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      // Fetch priority distribution
      const priorityResult = await fetchPriorityData();
      setPriorityData(priorityResult);
      
      // Fetch completion rate with selected time range
      const completionResult = await fetchCompletionRate(timeRange);
      setCompletionData(completionResult);
      
      // Fetch upcoming deadlines with selected time range
      const upcomingResult = await fetchUpcomingDeadlines(timeRange);
      setUpcomingTasks(upcomingResult);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const isLoading = loadingPriority || loadingCompletion || loadingUpcoming;
  const hasError = priorityError || completionError || upcomingError;

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
              Dashboard
            </Typography>
            
            <FormControl variant="outlined" size="medium" sx={{ 
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 200 }
            }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
                fullWidth
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      width: 'auto',
                      minWidth: '250px',
                    },
                  },
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                }}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={14}>Last 14 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {hasError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Error loading dashboard data. Please try again later.
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ width: '100%', mx: 0, px: { xs: 2, sm: 0 } }}>
              {/* Priority Distribution Chart */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>
                    Task Priority Distribution
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    {priorityError ? (
                      <Typography color="error">Failed to load priority data</Typography>
                    ) : (
                      <PriorityChart data={priorityData} />
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              {/* Completion Rate Chart */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>
                    Task Completion Rate
                  </Typography>
                  <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    {completionError ? (
                      <Typography color="error">Failed to load completion data</Typography>
                    ) : (
                      <CompletionRateChart data={completionData} />
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              {/* Upcoming Tasks List */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Deadlines
                  </Typography>
                  {upcomingError ? (
                    <Typography color="error">Failed to load upcoming tasks</Typography>
                  ) : (
                    <UpcomingTasksList tasks={upcomingTasks} />
                  )}
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage;
