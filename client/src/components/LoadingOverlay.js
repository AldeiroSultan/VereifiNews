import React from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';

const LoadingOverlay = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.75)' 
          : 'rgba(255, 255, 255, 0.75)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Box sx={{ 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: 3
      }}>
        <CircularProgress 
          size={80} 
          color="primary" 
          thickness={4}
          sx={{
            animation: 'pulse 1.5s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': {
                opacity: 0.6,
              },
              '50%': {
                opacity: 1,
              },
              '100%': {
                opacity: 0.6,
              },
            },
          }}
        />
        <AnalyticsIcon sx={{ 
          position: 'absolute',
          fontSize: 32,
          color: theme.palette.primary.main,
          animation: 'spin 3s infinite linear',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        }} />
      </Box>
      
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600,
          mb: 2,
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'fadeIn 0.5s ease-in-out',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(10px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        Analyzing article...
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary" 
        sx={{ 
          mt: 1,
          maxWidth: 300,
          textAlign: 'center',
          opacity: 0.8,
          animation: 'fadeIn 0.5s ease-in-out 0.2s both',
        }}
      >
        Our AI is processing your content and evaluating its credibility. This may take a moment.
      </Typography>
    </Box>
  );
};

export default LoadingOverlay;