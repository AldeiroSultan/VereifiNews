import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, useTheme } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

const Header = () => {
  const theme = useTheme();
  
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.primary.main
          }}>
            <ArticleOutlinedIcon sx={{ fontSize: 32, mr: 1.5 }} />
            <Typography 
              variant="h5" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              News Summarizer
            </Typography>
          </Box>
          
          <Box sx={{ ml: 2 }}>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              AI-Powered Article Analysis
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;