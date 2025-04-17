import React from 'react';
import { Box, Typography, Container, Link, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          News Summarizer & Credibility Checker © {year}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Powered by <Link href="#" color="primary" underline="hover">BART-large-CNN</Link> & Client-side Algorithms
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;