import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Chip, 
  Stack,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const ResultPanel = ({ summary, credibilityScore, credibilityFactors, articleText }) => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Determine credibility color and label
  let scoreColor = '#10b981'; // Default green
  let scoreLabel = 'High Credibility';
  
  if (credibilityScore < 40) {
    scoreColor = '#ef4444'; // Red
    scoreLabel = 'Low Credibility';
  } else if (credibilityScore < 70) {
    scoreColor = '#f59e0b'; // Yellow/Orange
    scoreLabel = 'Medium Credibility';
  }
  
  // Organize factors by type - with safe fallback if credibilityFactors is undefined
  const positiveFactors = credibilityFactors ? credibilityFactors.filter(f => f.type === 'positive') : [];
  const negativeFactors = credibilityFactors ? credibilityFactors.filter(f => f.type === 'negative') : [];
  const neutralFactors = credibilityFactors ? credibilityFactors.filter(f => f.type === 'neutral') : [];
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 0,
        border: '1px solid',
        borderColor: 'divider', 
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          '& .MuiTabs-indicator': {
            height: 3
          }
        }}
      >
        <Tab label="Summary" />
        <Tab label="Credibility Analysis" />
        <Tab label="Original Text" />
      </Tabs>
      
      {/* Summary Tab */}
      <Box hidden={tabValue !== 0} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
          Summary
        </Typography>
        
        <Box 
          sx={{ 
            p: 2.5, 
            bgcolor: 'background.default', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1" component="div" sx={{ lineHeight: 1.7 }}>
            {summary}
          </Typography>
        </Box>
      </Box>
      
      {/* Credibility Tab */}
      <Box hidden={tabValue !== 1} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          Credibility Analysis
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Credibility Score
            </Typography>
            <Chip 
              label={scoreLabel} 
              sx={{ 
                bgcolor: scoreColor + '20', 
                color: scoreColor,
                fontWeight: 500
              }} 
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                mr: 2, 
                fontWeight: 700,
                color: scoreColor
              }}
            >
              {credibilityScore}
            </Typography>
            
            <Box sx={{ flex: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={credibilityScore} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: 'rgba(0,0,0,0.05)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: scoreColor,
                    borderRadius: 5
                  }
                }} 
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">0</Typography>
                <Typography variant="body2" color="text.secondary">100</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Credibility Factors</Typography>
        
        {positiveFactors.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#10b981' }}>
              Positive Factors
            </Typography>
            <Stack spacing={1}>
              {positiveFactors.map((factor, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    p: 1.5,
                    bgcolor: '#f0fdf4',
                    borderRadius: 2
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ mr: 1.5, color: '#10b981' }} />
                  <Typography variant="body2">{factor.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
        
        {negativeFactors.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#ef4444' }}>
              Negative Factors
            </Typography>
            <Stack spacing={1}>
              {negativeFactors.map((factor, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    p: 1.5,
                    bgcolor: '#fef2f2',
                    borderRadius: 2
                  }}
                >
                  <ErrorOutlineIcon sx={{ mr: 1.5, color: '#ef4444' }} />
                  <Typography variant="body2">{factor.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
        
        {neutralFactors.length > 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500, color: '#3b82f6' }}>
              Other Information
            </Typography>
            <Stack spacing={1}>
              {neutralFactors.map((factor, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    p: 1.5,
                    bgcolor: '#eff6ff',
                    borderRadius: 2
                  }}
                >
                  <InfoOutlinedIcon sx={{ mr: 1.5, color: '#3b82f6' }} />
                  <Typography variant="body2">{factor.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
      
      {/* Original Text Tab */}
      <Box hidden={tabValue !== 2} sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
          Original Article
        </Typography>
        
        <Box 
          sx={{ 
            p: 2.5, 
            bgcolor: 'background.default', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            maxHeight: '500px',
            overflow: 'auto'
          }}
        >
          <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
            {articleText}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default ResultPanel;