import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CompletionRateChart = ({ data }) => {
  // If no data or empty array, show a message
  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          No completion rate data available
        </Typography>
      </Box>
    );
  }

  // Prepare data for the line chart
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: data.map(item => item.completionRate),
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63, 81, 181, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Completed Tasks',
        data: data.map(item => item.completed),
        borderColor: '#4caf50',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: 'Total Tasks',
        data: data.map(item => item.total),
        borderColor: '#ff9800',
        backgroundColor: 'transparent',
        borderDash: [3, 3],
        tension: 0.4,
      }
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            // For the completion rate dataset, add % symbol
            return value + (this.chart.data.datasets[0].data.includes(value) ? '%' : '');
          }
        }
      }
    },
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
            const label = context.dataset.label || '';
            const value = context.raw;
            
            if (label.includes('Completion Rate')) {
              return `${label}: ${value.toFixed(1)}%`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default CompletionRateChart;
