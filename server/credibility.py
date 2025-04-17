import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_credibility(text):
    """
    Analyze the credibility of an article based on various textual factors.
    Returns a score (0-100) and a list of factors.
    """
    factors = []
    score = 50  # Start with a neutral score
    
    # Normalize text for analysis
    text = text.lower()
    
    # 1. Check text length (longer articles tend to have more depth)
    if len(text) > 3000:
        score += 5
        factors.append({
            "type": "positive",
            "text": "Article length indicates depth of coverage"
        })
    elif len(text) < 1000:
        score -= 5
        factors.append({
            "type": "negative",
            "text": "Brief article may lack comprehensive details"
        })
    
    # 2. Check for statistical references
    stats_pattern = r'\d+(\.\d+)?(%|percent|percentage)'
    if re.search(stats_pattern, text):
        score += 7
        factors.append({
            "type": "positive",
            "text": "Contains statistical information"
        })
    
    # 3. Check for quotes (indicates sourcing)
    quotes_pattern = r'"([^"]*)"'
    quotes = re.findall(quotes_pattern, text)
    if quotes and len(quotes) > 0:
        score += 8
        factors.append({
            "type": "positive",
            "text": "Contains direct quotes from sources"
        })
    
    # 4. Check for citation patterns
    citation_pattern = r'(according to|said|reported by|cited|source|study)'
    if re.search(citation_pattern, text):
        score += 10
        factors.append({
            "type": "positive",
            "text": "References external sources or studies"
        })
    
    # 5. Check for sensationalist language
    sensationalist_words = r'(shocking|unbelievable|mind-blowing|jaw-dropping|you won\'t believe|incredible|amazing|outrageous|scandal)'
    if re.search(sensationalist_words, text):
        score -= 15
        factors.append({
            "type": "negative",
            "text": "Contains sensationalist language"
        })
    
    # 6. Check for balanced perspective
    balanced_perspective_words = r'(however|on the other hand|alternatively|in contrast|while|despite|nevertheless|conversely|critics|proponents)'
    if re.search(balanced_perspective_words, text):
        score += 8
        factors.append({
            "type": "positive",
            "text": "Presents multiple perspectives"
        })
    
    # 7. Check for hedging language (indicates scientific caution)
    hedging_words = r'(may|might|could|possibly|potentially|suggests|indicates|appears|likely)'
    if re.search(hedging_words, text):
        score += 5
        factors.append({
            "type": "positive",
            "text": "Uses appropriately cautious language"
        })
    
    # 8. Check for excessive certainty
    certainty_claims = r'(absolutely|definitely|undoubtedly|without question|100 percent|guaranteed|proven fact|irrefutable)'
    if re.search(certainty_claims, text):
        score -= 8
        factors.append({
            "type": "negative",
            "text": "Makes claims of absolute certainty"
        })
    
    # 9. General readability check (simple heuristic)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s.strip() for s in sentences if s.strip()]
    avg_sentence_length = len(text) / max(len(sentences), 1)
    
    if avg_sentence_length > 100:
        score -= 5
        factors.append({
            "type": "negative",
            "text": "Complex sentence structure may obscure meaning"
        })
    
    # 10. Check for academic/technical terms (indicates expertise)
    academic_terms = r'(methodology|analysis|hypothesis|conclusion|investigation|evidence-based|peer-reviewed|correlation|causation|significant|variable)'
    if re.search(academic_terms, text):
        score += 7
        factors.append({
            "type": "positive",
            "text": "Uses technical or academic language"
        })
    
    # 11. Check for clickbait title patterns
    clickbait_patterns = r'(top \d+|what happens next|won\'t believe|changed my life|mind-blowing|trending now|gone wrong)'
    if re.search(clickbait_patterns, text[:500]):  # Check mainly in the beginning
        score -= 12
        factors.append({
            "type": "negative",
            "text": "Contains clickbait-style patterns"
        })
    
    # 12. Check for date references (timeliness)
    date_patterns = r'(january|february|march|april|may|june|july|august|september|october|november|december|yesterday|today|last week|this week)'
    if re.search(date_patterns, text, re.IGNORECASE):
        score += 5
        factors.append({
            "type": "positive",
            "text": "Includes temporal references for context"
        })
    
    # Add neutral information factor
    factors.append({
        "type": "neutral",
        "text": "Analysis uses text patterns to estimate credibility"
    })
    
    # Ensure score is within 0-100 range
    score = max(0, min(100, score))
    
    return {
        "score": round(score),
        "factors": factors
    }