from flask import Flask, request, jsonify
try:
    from flask_cors import CORS
except ImportError:
    # Fallback if flask_cors isn't available
    print("Warning: flask_cors not available, CORS functionality disabled")
    class CORS:
        def __init__(self, app=None):
            pass
import json
import logging
from summarizer import generate_summary
from credibility import analyze_credibility
from url_processor import extract_article_from_url, is_valid_url

# Configure logging
logging.basicConfig(level=logging.INFO,
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Server is running"})

@app.route('/api/summarize', methods=['POST'])
def summarize():
    """Endpoint to summarize text using BART model"""
    try:
        data = request.json
        
        # Check if we've received a URL or text
        if 'url' in data and data['url']:
            url = data['url']
            if not is_valid_url(url):
                return jsonify({"error": "Invalid URL format"}), 400
                
            # Extract article from URL
            article_data = extract_article_from_url(url)
            
            if not article_data['success']:
                return jsonify({"error": f"Failed to extract article from URL: {article_data.get('error', 'Unknown error')}"}), 400
                
            text = article_data['text']
            # Add title if available
            if article_data.get('title'):
                text = article_data['title'] + "\n\n" + text
        elif 'text' in data and data['text']:
            text = data['text']
        else:
            return jsonify({"error": "No text or URL provided"}), 400
        
        model_type = data.get('model_type', 'bart')  # Default to BART
        max_length = data.get('max_length', 150)     # Default max length
        
        logger.info(f"Generating summary using model: {model_type}")
        
        # Generate summary
        summary = generate_summary(text, model_type=model_type, max_length=max_length)
        
        # Analyze credibility
        credibility_analysis = analyze_credibility(text)
        
        return jsonify({
            "summary": summary,
            "credibility_score": credibility_analysis["score"],
            "credibility_factors": credibility_analysis["factors"],
            "original_text": text
        })
    
    except Exception as e:
        logger.error(f"Error processing summarization request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/extract-url', methods=['POST'])
def extract_url():
    """Endpoint to extract article content from a URL"""
    try:
        data = request.json
        if not data or 'url' not in data:
            return jsonify({"error": "No URL provided"}), 400
        
        url = data['url']
        
        if not is_valid_url(url):
            return jsonify({"error": "Invalid URL format"}), 400
        
        # Extract article from URL
        article_data = extract_article_from_url(url)
        
        if not article_data['success']:
            return jsonify({"error": f"Failed to extract article from URL: {article_data.get('error', 'Unknown error')}"}), 400
        
        return jsonify(article_data)
    
    except Exception as e:
        logger.error(f"Error processing URL extraction request: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Endpoint to analyze credibility only"""
    try:
        data = request.json
        if not data or ('text' not in data and 'url' not in data):
            return jsonify({"error": "No text or URL provided"}), 400
        
        if 'url' in data and data['url']:
            url = data['url']
            if not is_valid_url(url):
                return jsonify({"error": "Invalid URL format"}), 400
                
            # Extract article from URL
            article_data = extract_article_from_url(url)
            
            if not article_data['success']:
                return jsonify({"error": f"Failed to extract article from URL: {article_data.get('error', 'Unknown error')}"}), 400
                
            text = article_data['text']
        else:
            text = data['text']
        
        # Analyze credibility
        credibility_analysis = analyze_credibility(text)
        
        return jsonify(credibility_analysis)
    
    except Exception as e:
        logger.error(f"Error processing credibility analysis request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Load model at startup
    logger.info("Starting server and initializing models...")
    
    # Run the app
    app.run(host='0.0.0.0', port=5000, debug=True)