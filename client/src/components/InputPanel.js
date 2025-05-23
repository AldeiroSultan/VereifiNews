import React, { useState, useRef } from 'react';
import { 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  TextField, 
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Stack,
  useTheme
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LinkIcon from '@mui/icons-material/Link';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StandaloneBlueButton from './StandaloneBlueButton'; // Import the new standalone button

const InputPanel = ({ onSubmit, activeModel, onModelChange }) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState(activeModel);
  const buttonActionRef = useRef(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    onModelChange(model);
  };
  
  const prepareSubmission = () => {
    let content = '';
    let inputType = 'text';
    
    if (tabValue === 0) {
      content = text;
      inputType = 'text';
    } else if (tabValue === 1) {
      content = url;
      inputType = 'url';
    }
    
    buttonActionRef.current = () => {
      onSubmit(content, selectedModel, inputType);
    };
  };
  
  const handleSubmit = () => {
    if (buttonActionRef.current) {
      buttonActionRef.current();
      buttonActionRef.current = null;
    }
  };

  // Model options
  const models = [
    { value: 'client', label: 'Quick Summary (Client-side)', description: 'Fast processing with client-side algorithms' },
    { value: 'bart', label: 'BART-large-CNN', description: 'High-quality summaries using Facebook\'s BART model' },
  ];
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
        }
      }}
    >
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        Input Article
      </Typography>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0'
          }
        }}
      >
        <Tab 
          icon={<TextSnippetIcon />} 
          label="Text" 
          iconPosition="start" 
          sx={{ minHeight: 48 }}
        />
        <Tab 
          icon={<LinkIcon />} 
          label="URL" 
          iconPosition="start"
          sx={{ minHeight: 48 }}
        />
        <Tab 
          icon={<UploadFileIcon />} 
          label="File Upload" 
          iconPosition="start"
          disabled
          sx={{ minHeight: 48 }}
        />
      </Tabs>
      
      <Box sx={{ mb: 3 }}>
        {tabValue === 0 && (
          <TextField
            label="Paste article text"
            multiline
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            placeholder="Paste the full article text here..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                },
                '&.Mui-focused': {
                  boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)'
                }
              }
            }}
          />
        )}
        
        {tabValue === 1 && (
          <>
            <TextField
              label="Enter article URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              placeholder="https://example.com/news-article"
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)'
                  }
                }
              }}
            />
            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              The application will extract the article content from the provided URL. For best results, use URLs from news websites.
            </Alert>
          </>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Summarization Model
        </Typography>
        
        <FormControl fullWidth sx={{ 
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)'
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)'
            }
          }
        }}>
          <InputLabel id="model-select-label">Select Model</InputLabel>
          <Select
            labelId="model-select-label"
            id="model-select"
            value={selectedModel}
            label="Select Model"
            onChange={handleModelChange}
          >
            {models.map(model => (
              <MenuItem key={model.value} value={model.value}>
                <Stack direction="column" spacing={0.5}>
                  <Typography variant="body1">{model.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{model.description}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {selectedModel === 'bart' && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <InfoOutlinedIcon fontSize="small" />
              <Typography variant="body2">
                BART model requires the backend server to be running. First use may take longer as the model loads.
              </Typography>
            </Stack>
          </Alert>
        )}
      </Box>
      
      {/* Use the new standalone button with fixed blue color */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        mt: 4,
        mb: 2,
        minHeight: '60px',
        position: 'relative',
        textAlign: 'center'
      }}>
        <StandaloneBlueButton 
          label="Summarize Article"
          onClick={handleSubmit}
          disabled={tabValue === 0 ? !text.trim() : !url.trim()}
          onPrepare={prepareSubmission}
        />
      </Box>
    </Paper>
  );
};

export default InputPanel;