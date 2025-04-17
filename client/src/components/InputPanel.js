import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  TextField, 
  Button, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Tooltip,
  Stack,
  Alert
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import LinkIcon from '@mui/icons-material/Link';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const InputPanel = ({ onSubmit, activeModel, onModelChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState(activeModel);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModel(model);
    onModelChange(model);
  };
  
  const handleSubmit = () => {
    let content = '';
    let inputType = 'text';
    
    if (tabValue === 0) {
      content = text;
      inputType = 'text';
    } else if (tabValue === 1) {
      content = url;
      inputType = 'url';
    }
    
    onSubmit(content, selectedModel, inputType);
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3, 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3
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
            />
            <Alert severity="info" sx={{ mt: 2 }}>
              The application will extract the article content from the provided URL. For best results, use URLs from news websites.
            </Alert>
          </>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Summarization Model
        </Typography>
        
        <RadioGroup
          value={selectedModel}
          onChange={handleModelChange}
          row
        >
          <FormControlLabel
            value="client"
            control={<Radio />}
            label="Quick Summary (Client-side)"
          />
          
          <Stack direction="row" alignItems="center">
            <FormControlLabel
              value="bart"
              control={<Radio />}
              label="Advanced Summary (BART-large-CNN)"
            />
            <Tooltip 
              title="Requires backend server with Python and transformers library. More accurate but slower."
              arrow
              placement="top"
            >
              <InfoOutlinedIcon fontSize="small" color="action" sx={{ ml: 0.5 }} />
            </Tooltip>
          </Stack>
        </RadioGroup>
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        size="large" 
        onClick={handleSubmit}
        disabled={tabValue === 0 ? !text.trim() : !url.trim()}
        sx={{ px: 4 }}
      >
        Summarize Article
      </Button>
    </Paper>
  );
};

export default InputPanel;