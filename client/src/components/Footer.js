import React from 'react';
import { Box, Typography, Container, Link, Chip, useTheme, Stack, Divider } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 3
        }}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: '500px' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mb: 1.5 }}>
              News Summarizer & Credibility Checker
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Leverage advanced AI to quickly summarize news articles and evaluate their credibility, 
              helping you navigate information more efficiently and confidently.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              © {year} News Summarizer. All rights reserved.
            </Typography>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
          
          <Box>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, mb: 1.5, textAlign: { xs: 'center', md: 'left' } }}>
              Powered by AI Models
            </Typography>
            
            <Stack spacing={1.5}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)',
              }}>
                <AutoAwesomeIcon color="primary" />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      BART-large-CNN
                    </Typography>
                    <Chip 
                      label="Advanced" 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.625rem',
                        bgcolor: theme.palette.primary.main,
                        color: '#fff',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Facebook's state-of-the-art abstractive summarization model
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                p: 1.5,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.1)',
              }}>
                <LightbulbIcon sx={{ color: theme.palette.secondary.main }} />
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Client-side Algorithm
                    </Typography>
                    <Chip 
                      label="Fast" 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.625rem',
                        bgcolor: theme.palette.secondary.main,
                        color: '#fff',
                        fontWeight: 600
                      }} 
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Efficient extractive summarization for immediate results
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Learn more about <Link href="https://huggingface.co/facebook/bart-large-cnn" target="_blank" color="primary" underline="hover">BART-large-CNN</Link> | 
            <Link href="https://github.com/facebook/fairseq/blob/main/examples/bart/README.md" target="_blank" color="primary" underline="hover" sx={{ ml: 1 }}>Facebook AI Research</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;