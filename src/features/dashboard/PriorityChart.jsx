import { Pie } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PriorityChart = ({ data }) => {
  // If no data or empty array, show a message
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          No priority data available
        </Typography>
      </Box>
    );
  }

  // Prepare data for the pie chart
  const chartData = {
    labels: data.map(item => item.priority),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: [
          '#f44336', // High - Red
          '#ff9800', // Medium - Orange
          '#4caf50', // Low - Green
          '#9e9e9e', // Any other priority - Grey
        ],
        borderColor: [
          '#d32f2f',
          '#f57c00',
          '#388e3c',
          '#757575',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          boxWidth: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} tasks (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default PriorityChart;
