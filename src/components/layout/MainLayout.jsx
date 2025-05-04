import { Box, Toolbar, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState, useEffect, useCallback } from 'react';

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Close sidebar on mobile by default
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);
  
  // Use useCallback to prevent unnecessary re-renders
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prevState => !prevState);
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* Navbar - full width, fixed at top */}
      <Navbar toggleSidebar={toggleSidebar} />
      
      {/* Sidebar - fixed position */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={toggleSidebar} 
      />
      
      {/* Main content wrapper - takes remaining width */}
      <Box 
        component="main"
        sx={{ 
          position: 'absolute',
          right: 0,
          top: 0,
          paddingTop: '64px', // Height of AppBar
          height: 'calc(100vh - 64px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          width: isMobile ? '100%' : (sidebarOpen ? `calc(100% - 240px)` : '100%'),
          transition: theme => theme.transitions.create(['width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          pt: 0, // Remove top padding
        }}
      >
        {/* Page content */}
        <Toolbar />
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          overflow: 'auto',
          backgroundColor: (theme) => theme.palette.grey[100]
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
