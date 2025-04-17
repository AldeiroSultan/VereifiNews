"""
Test script for URL extraction functionality
Run this script to test if the URL extraction is working properly
"""

import sys
import json
from url_processor import extract_article_from_url, is_valid_url

def test_url_extraction(url):
    """Test extracting article from a URL"""
    print(f"Testing URL extraction for: {url}")
    print("-" * 80)
    
    if not is_valid_url(url):
        print("❌ Invalid URL format!")
        return
    
    print("✓ URL format is valid")
    print("Extracting article content...")
    
    result = extract_article_from_url(url)
    
    if result['success']:
        print(f"✓ Successfully extracted article using {result['method']}")
        print("-" * 80)
        print(f"Title: {result.get('title', 'N/A')}")
        print("-" * 80)
        
        # Print first 500 chars of text with word count
        text = result.get('text', '')
        word_count = len(text.split())
        print(f"Text preview (first 500 chars of {word_count} words total):")
        print(text[:500] + "...")
        print("-" * 80)
        
        if 'authors' in result and result['authors']:
            print(f"Authors: {', '.join(result['authors'])}")
        
        if 'publish_date' in result and result['publish_date']:
            print(f"Publish date: {result['publish_date']}")
    else:
        print(f"❌ Failed to extract article: {result.get('error', 'Unknown error')}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a URL to test")
        print("Usage: python test_url_extraction.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    test_url_extraction(url)