# News Summarizer & Credibility Checker

A modern web application that summarizes news articles and evaluates their credibility using both client-side algorithms and Facebook's BART-large-CNN model.

![News Summarizer Screenshot](screenshot.png)

## Features

- **Article Summarization**: Generate concise, accurate summaries using extractive and abstractive techniques
- **Credibility Analysis**: Evaluate news credibility based on multiple factors
- **Multiple Input Methods**: Process text directly or extract content from URLs
- **Dual Processing Options**:
  - Quick Summary: Client-side processing for immediate results
  - Advanced Summary: BART-large-CNN model for high-quality summaries

## Project Structure

```
news-summarizer/
├── client/                # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── components/    # UI components
│   │   ├── styles/        # CSS files
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
└── server/                # Backend Flask API
    ├── app.py             # Main Flask application
    ├── summarizer.py      # BART model implementation
    ├── credibility.py     # Credibility analysis logic
    ├── url_processor.py   # URL content extraction
    └── requirements.txt   # Python dependencies
```

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn
- pip (Python package manager)

## Setup Instructions

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd news-summarizer
```

### Step 2: Set up the Backend (Flask Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   
   # macOS/Linux
   python3 -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
   
   This will install Flask, PyTorch, transformers, and other required dependencies.

5. Verify the installation by running the test script for URL extraction:
   ```bash
   python test_url_extraction.py https://example.com/news-article
   ```

### Step 3: Set up the Frontend (React Application)

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Step 4: Running the Application

1. Start the backend server:
   ```bash
   # Make sure you're in the server directory with the virtual environment activated
   python app.py
   ```
   The server will start on http://localhost:5000

2. In a separate terminal, start the frontend application:
   ```bash
   # Make sure you're in the client directory
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Using the Application

### Text Summarization

1. Open the application in your browser
2. In the "Text" tab, paste the article text
3. Choose between "Quick Summary" or "Advanced Summary"
4. Click "Summarize Article"
5. View the results in the tabs below:
   - Summary: The condensed version of your article
   - Credibility Analysis: Score and factors affecting credibility
   - Original Text: Your input for reference

### URL Processing

1. Click the "URL" tab in the input panel
2. Enter a valid URL to a news article
3. Select your preferred summarization model
4. Click "Summarize Article"

## Troubleshooting

### Backend Issues

- **Missing Modules**: If you see import errors, ensure all packages are installed:
  ```bash
  pip install flask-cors beautifulsoup4 newspaper3k
  ```

- **Server Won't Start**: Check for port conflicts. Another application might be using port 5000.

- **Model Download Issues**: The first time you use the BART model, it will download large model files. Ensure you have:
  - A stable internet connection
  - Sufficient disk space (approximately 2GB)
  - Patience (download may take several minutes)

### Frontend Issues

- **npm Start Fails**: Try clearing the npm cache:
  ```bash
  npm cache clean --force
  ```

- **Cannot Connect to Server**: Ensure the Flask backend is running before using BART model or URL functionality.

- **URL Extraction Issues**: Some websites block web scraping. If URL extraction fails:
  - Try a different news source
  - Copy and paste the article text directly

## Advanced Configuration

### Changing the Server Port

To change the default port (5000) for the backend server, modify the `app.run()` line in `app.py`:

```python
app.run(host='0.0.0.0', port=8000, debug=True)
```

Then update the proxy in the client's `package.json`:

```json
"proxy": "http://localhost:8000"
```

### Customizing Summarization Parameters

Adjust the summarization behavior by modifying the parameters in `summarizer.py`:

```python
summary_ids = bart_model.generate(
    inputs["input_ids"], 
    num_beams=4,           # Increase for better quality, slower generation
    min_length=30,         # Minimum summary length
    max_length=max_length, # Maximum summary length
    early_stopping=True
)
```

## License

MIT

## Acknowledgments

- This application uses [Facebook's BART-large-CNN model](https://huggingface.co/facebook/bart-large-cnn)
- Built with React, Material UI, Flask, and PyTorch