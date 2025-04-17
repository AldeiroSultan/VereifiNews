import logging
import requests
try:
    from bs4 import BeautifulSoup
except ImportError:
    # Fallback for BeautifulSoup
    print("Warning: BeautifulSoup (bs4) not available")
    BeautifulSoup = None

try:
    from newspaper import Article
except ImportError:
    # Fallback for newspaper
    print("Warning: newspaper3k not available")
    Article = None
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def extract_article_from_url(url):
    """
    Extract article content from a URL using newspaper3k with fallback to BeautifulSoup
    
    Args:
        url (str): URL of the article
        
    Returns:
        dict: Dictionary with title, text, and metadata of the article
    """
    try:
        logger.info(f"Extracting article from URL: {url}")
        
        # Method 1: Try using newspaper3k (best for news articles)
        try:
            article = Article(url)
            article.download()
            article.parse()
            
            # If article text is too short, it probably failed to extract properly
            if len(article.text) < 100 and not article.title:
                logger.warning("Newspaper3k extraction yielded insufficient content, trying BeautifulSoup")
                raise Exception("Insufficient content extracted")
            
            return {
                "title": article.title,
                "text": article.text,
                "authors": article.authors,
                "publish_date": article.publish_date.isoformat() if article.publish_date else None,
                "top_image": article.top_image,
                "success": True,
                "method": "newspaper3k"
            }
        
        except Exception as e:
            logger.warning(f"Newspaper3k extraction failed: {str(e)}")
            # Fall back to BeautifulSoup
        
        # Method 2: BeautifulSoup extraction
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch URL, status code: {response.status_code}")
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Get title
        title = soup.title.text.strip() if soup.title else ""
        
        # Extract text content
        # Remove script and style elements
        for script_or_style in soup(['script', 'style', 'header', 'footer', 'nav']):
            script_or_style.extract()
        
        # Find the main content
        main_content = None
        
        # Common content containers
        potential_content_elements = [
            soup.find('article'),
            soup.find('main'),
            soup.find(attrs={"role": "main"}),
            soup.find(class_=re.compile("(content|article|post|entry)")),
            soup.find(id=re.compile("(content|article|post|entry)"))
        ]
        
        # Use first valid content container
        for element in potential_content_elements:
            if element and len(element.get_text(strip=True)) > 300:
                main_content = element
                break
        
        # If no main content found, fall back to the body
        if not main_content:
            logger.warning("No specific content container found, using body")
            main_content = soup.body
        
        if not main_content:
            raise Exception("Could not locate article content")
        
        # Extract paragraphs
        paragraphs = main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        text = "\n\n".join([p.get_text().strip() for p in paragraphs if len(p.get_text().strip()) > 20])
        
        # If we still don't have enough text, get all text
        if len(text) < 200:
            logger.warning("Paragraph extraction yielded insufficient content, using all text")
            text = main_content.get_text(separator='\n\n')
        
        # Clean up the text
        text = re.sub(r'\n+', '\n\n', text)  # Replace multiple newlines with double newlines
        text = re.sub(r'\s+', ' ', text)     # Replace multiple spaces with single space
        
        return {
            "title": title,
            "text": text,
            "success": True,
            "method": "beautifulsoup"
        }
    
    except Exception as e:
        logger.error(f"Failed to extract article from URL: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

def is_valid_url(url):
    """
    Check if a URL is valid
    
    Args:
        url (str): URL to validate
        
    Returns:
        bool: True if URL is valid, False otherwise
    """
    pattern = re.compile(
        r'^(?:http|https)://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ipv4
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    return bool(pattern.match(url))