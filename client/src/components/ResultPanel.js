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
  Tab,
  useTheme,
  Fade
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArticleIcon from '@mui/icons-material/Article';

const ResultPanel = ({ summary, credibilityScore, credibilityFactors, articleText }) => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  
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
    <Fade in={true} timeout={800}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 0,
          border: '1px solid',
          borderColor: 'divider', 
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[3],
          }
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
          <Tab 
            icon={<LibraryBooksIcon />} 
            label="Summary" 
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab 
            icon={<AnalyticsIcon />} 
            label="Credibility Analysis" 
            iconPosition="start"
            sx={{ py: 2 }}
          />
          <Tab 
            icon={<ArticleIcon />} 
            label="Original Text" 
            iconPosition="start"
            sx={{ py: 2 }}
          />
        </Tabs>
        
        {/* Summary Tab */}
        <Box hidden={tabValue !== 0} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            Summary
          </Typography>
          
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: 'background.default', 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '5px',
                height: '100%',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '4px 0 0 4px'
              }
            }}
          >
            <Typography variant="body1" component="div" sx={{ lineHeight: 1.8, letterSpacing: '0.015em' }}>
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
                  fontWeight: 600,
                  borderRadius: '50px',
                  px: 1
                }} 
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
            }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  mr: 2, 
                  fontWeight: 700,
                  color: scoreColor,
                  minWidth: '70px',
                  textAlign: 'center'
                }}
              >
                {credibilityScore}
              </Typography>
              
              <Box sx={{ flex: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={credibilityScore} 
                  sx={{ 
                    height: 12, 
                    borderRadius: 6,
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: scoreColor,
                      borderRadius: 6,
                      transition: 'transform 1s cubic-bezier(0.65, 0, 0.35, 1)'
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
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Credibility Factors</Typography>
          
          {positiveFactors.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Positive Factors
              </Typography>
              <Stack spacing={1.5}>
                {positiveFactors.map((factor, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4',
                      borderRadius: 3,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                      }
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
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                <ErrorOutlineIcon sx={{ mr: 1 }} /> Negative Factors
              </Typography>
              <Stack spacing={1.5}>
                {negativeFactors.map((factor, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                      borderRadius: 3,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                      }
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
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                <InfoOutlinedIcon sx={{ mr: 1 }} /> Other Information
              </Typography>
              <Stack spacing={1.5}>
                {neutralFactors.map((factor, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      p: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                      borderRadius: 3,
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                      }
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
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
            Original Article
          </Typography>
          
          <Box 
            sx={{ 
              p: 3, 
              bgcolor: 'background.default', 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              maxHeight: '500px',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                }
              }
            }}
          >
            <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {articleText}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default ResultPanel;