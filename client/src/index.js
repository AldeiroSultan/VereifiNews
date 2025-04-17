import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useState, useMemo, createContext, useContext } from 'react';

// Create a context for the color mode
export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light'
});

export const useColorMode = () => useContext(ColorModeContext);

// Root component to handle theme
function ThemedApp() {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme', newMode);
      },
      mode,
    }),
    [mode],
  );

  // Create a theme instance
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#3b82f6',
            dark: '#2563eb',
            light: '#60a5fa',
          },
          secondary: {
            main: '#f59e0b',
            dark: '#d97706',
            light: '#fbbf24',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#1e293b' : '#e2e8f0',
            secondary: mode === 'light' ? '#64748b' : '#94a3b8',
          },
          success: {
            main: '#10b981',
          },
          error: {
            main: '#ef4444',
          },
          warning: {
            main: '#f59e0b',
          },
          info: {
            main: '#3b82f6',
          },
        },
        typography: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
          button: {
            fontWeight: 600,
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 16,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 50, // Circular buttons
                padding: '10px 24px',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light' 
                  ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                  : '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3)',
              },
              elevation1: {
                boxShadow: mode === 'light'
                  ? '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)'
                  : '0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3)',
              },
              elevation2: {
                boxShadow: mode === 'light'
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
);