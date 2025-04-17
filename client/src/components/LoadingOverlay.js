import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

const LoadingOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <CircularProgress size={60} color="primary" />
      <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
        Analyzing article...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        This may take a moment
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;