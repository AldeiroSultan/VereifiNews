import React, { useState } from 'react';
import { Container, Box, Typography, useTheme } from '@mui/material';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingOverlay from './components/LoadingOverlay';
import BoxPreloader from './components/BoxPreLoader'; // Import the preloader component
import { processArticleClientSide } from './utils/clientSummarizer';
import axios from 'axios';

function App() {
  const theme = useTheme();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articleText, setArticleText] = useState('');
  const [activeModel, setActiveModel] = useState('client'); // 'client' or 'bart'

  const handleSubmit = async (text, model, inputType = 'text') => {
    if (!text.trim()) {
      setError('Please enter article text or URL.');
      return;
    }

    // Wait for button animation to complete before showing loading overlay
    // This delay happens inside the AnimatedButton component
    
    setLoading(true);
    setError(null);

    try {
      let resultData;
      let apiPayload = {};

      // Prepare the API payload based on input type
      if (inputType === 'text') {
        apiPayload = { text: text };
        setArticleText(text); // Store the original text
      } else if (inputType === 'url') {
        apiPayload = { url: text };
        // Original text will be returned by the server
      }

      if (model === 'client') {
        // If it's a URL and using client-side model, we need to extract content first
        if (inputType === 'url') {
          try {
            const extractResponse = await axios.post('/api/extract-url', { url: text });
            if (extractResponse.data && extractResponse.data.success) {
              const extractedText = extractResponse.data.text;
              setArticleText(extractedText);
              
              // Now process the extracted text
              resultData = processArticleClientSide(extractedText);
            } else {
              throw new Error(extractResponse.data.error || 'Failed to extract content from URL');
            }
          } catch (extractError) {
            console.error('URL extraction error:', extractError);
            setError('Failed to extract content from the URL. Please try pasting the article text directly.');
            setLoading(false);
            return;
          }
        } else {
          // Process text directly using client-side algorithms
          resultData = processArticleClientSide(text);
        }
        
        // Ensure default values for safety
        if (!resultData.credibilityFactors) {
          resultData.credibilityFactors = [];
        }
        
        setTimeout(() => {
          setResult(resultData);
          setLoading(false);
        }, 1000); // Add slight delay for UX
      } else {
        // Process using server-side BART model
        try {
          const response = await axios.post('/api/summarize', {
            ...apiPayload,
            model_type: 'bart'
          });
          
          resultData = {
            summary: response.data.summary || "No summary generated.",
            credibilityScore: response.data.credibility_score || 50,
            credibilityFactors: response.data.credibility_factors || []
          };
          
          // If we sent a URL, get the original text from the response
          if (inputType === 'url' && response.data.original_text) {
            setArticleText(response.data.original_text);
          }
          
          setResult(resultData);
        } catch (apiError) {
          console.error('API Error:', apiError);
          if (apiError.response?.data?.error) {
            setError(apiError.response.data.error);
          } else {
            setError('Backend server error. Please ensure the Flask server is running or try using the client-side model.');
          }
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Error processing article:', err);
      setError(err.response?.data?.error || 'An error occurred while processing the article.');
      setLoading(false);
    }
  };

  const handleModelChange = (model) => {
    setActiveModel(model);
  };

  return (
    <BoxPreloader minDisplayTime={2500}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>
        <Header />
        
        <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
          {error && (
            <Box sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2', 
              color: theme.palette.mode === 'dark' ? '#f87171' : '#b91c1c',
              borderRadius: 2,
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
            }}>
              <Typography variant="body1">{error}</Typography>
            </Box>
          )}
          
          <InputPanel 
            onSubmit={handleSubmit} 
            activeModel={activeModel}
            onModelChange={handleModelChange}
          />
          
          {result && !loading && (
            <ResultPanel 
              summary={result.summary} 
              credibilityScore={result.credibilityScore} 
              credibilityFactors={result.credibilityFactors}
              articleText={articleText}
            />
          )}
        </Container>
        
        <Footer />
        
        {loading && <LoadingOverlay />}
      </Box>
    </BoxPreloader>
  );
}

export default App;