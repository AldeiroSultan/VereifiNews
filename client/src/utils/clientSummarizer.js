/**
 * Client-side implementation of text summarization and credibility analysis
 */

/**
 * Process article text and provide summary and credibility analysis
 * @param {string} text - Article text
 * @returns {Object} - Result containing summary and credibility analysis
 */
export const processArticleClientSide = (text) => {
    // 1. Summarization
    const summary = summarizeText(text);
    
    // 2. Credibility analysis
    const credibilityAnalysis = analyzeCredibility(text);
    
    return {
      summary,
      credibilityScore: credibilityAnalysis.score,
      credibilityFactors: credibilityAnalysis.factors
    };
  };
  
  /**
   * Text summarization algorithm (extractive approach)
   * @param {string} text - Text to summarize
   * @returns {string} - Summarized text
   */
  export const summarizeText = (text) => {
    // Split text into sentences
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    
    if (sentences.length === 0) {
      return "Unable to summarize. Please provide more content.";
    }
    
    // Calculate word frequency (simple TF)
    const wordFreq = {};
    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
      'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 
      'about', 'as', 'of', 'that', 'this', 'these', 'those', 'it', 'its',
      'they', 'them', 'their', 'there', 'here', 'where', 'when', 'how',
      'has', 'have', 'had', 'not', 'no', 'nor', 'if', 'else', 'then',
      'so', 'than', 'up', 'down', 'out', 'off', 'over', 'under'
    ]);
    
    sentences.forEach(sentence => {
      // Tokenize and clean
      const words = sentence.toLowerCase().split(/\W+/).filter(word => 
        word.length > 1 && !stopWords.has(word)
      );
      
      // Count word frequency
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
    });
    
    // Score sentences based on word frequency
    const sentenceScores = sentences.map(sentence => {
      const words = sentence.toLowerCase().split(/\W+/).filter(word => word.length > 1);
      let score = 0;
      
      words.forEach(word => {
        if (wordFreq[word]) {
          score += wordFreq[word];
        }
      });
      
      // Normalize by sentence length (with a minimum to avoid division by zero)
      return {
        text: sentence.trim(),
        score: score / Math.max(words.length, 1)
      };
    });
    
    // Sort sentences by score (descending)
    sentenceScores.sort((a, b) => b.score - a.score);
    
    // Select top sentences (about 25% of the original length, minimum 3, maximum 7)
    const numSentences = Math.min(Math.max(Math.ceil(sentences.length * 0.25), 3), 7);
    
    // Get top sentences
    const topSentences = sentenceScores.slice(0, numSentences);
    
    // Map to original indices
    const topIndices = topSentences.map(s => {
      return sentences.findIndex(sentence => sentence.trim() === s.text);
    });
    
    // Sort by original order
    topIndices.sort((a, b) => a - b);
    
    // Join the selected sentences in their original order
    const summarySentences = topIndices.map(index => sentences[index].trim());
    let result = summarySentences.join('. ');
    
    // Ensure proper ending punctuation
    if (!result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) {
      result += '.';
    }
    
    return result;
  };
  
  /**
   * Credibility analysis algorithm
   * @param {string} text - Text to analyze
   * @returns {Object} - Credibility score and factors
   */
  export const analyzeCredibility = (text) => {
    // This is a simplified version that checks for common markers of credibility
    const factors = [];
    let score = 50; // Start with a neutral score
    
    // Normalize text for analysis
    const normalizedText = text.toLowerCase();
    
    // 1. Check text length (longer articles tend to have more depth)
    if (text.length > 3000) {
      score += 5;
      factors.push({
        type: 'positive',
        text: 'Article length indicates depth of coverage'
      });
    } else if (text.length < 1000) {
      score -= 5;
      factors.push({
        type: 'negative',
        text: 'Brief article may lack comprehensive details'
      });
    }
    
    // 2. Check for statistical references
    const statsPattern = /\d+(\.\d+)?(%|percent|percentage)/i;
    if (statsPattern.test(normalizedText)) {
      score += 7;
      factors.push({
        type: 'positive',
        text: 'Contains statistical information'
      });
    }
    
    // 3. Check for quotes (indicates sourcing)
    const quotesPattern = /"([^"]*)"/g;
    const quotes = normalizedText.match(quotesPattern);
    if (quotes && quotes.length > 0) {
      score += 8;
      factors.push({
        type: 'positive',
        text: 'Contains direct quotes from sources'
      });
    }
    
    // 4. Check for citation patterns
    const citationPattern = /(according to|said|reported by|cited|source|study)/i;
    if (citationPattern.test(normalizedText)) {
      score += 10;
      factors.push({
        type: 'positive',
        text: 'References external sources or studies'
      });
    }
    
    // 5. Check for sensationalist language
    const sensationalistWords = /(shocking|unbelievable|mind-blowing|jaw-dropping|you won't believe|incredible|amazing|outrageous|scandal)/i;
    if (sensationalistWords.test(normalizedText)) {
      score -= 15;
      factors.push({
        type: 'negative',
        text: 'Contains sensationalist language'
      });
    }
    
    // 6. Check for balanced perspective
    const balancedPerspectiveWords = /(however|on the other hand|alternatively|in contrast|while|despite|nevertheless|conversely|critics|proponents)/i;
    if (balancedPerspectiveWords.test(normalizedText)) {
      score += 8;
      factors.push({
        type: 'positive',
        text: 'Presents multiple perspectives'
      });
    }
    
    // 7. Check for hedging language (indicates scientific caution)
    const hedgingWords = /(may|might|could|possibly|potentially|suggests|indicates|appears|likely)/i;
    if (hedgingWords.test(normalizedText)) {
      score += 5;
      factors.push({
        type: 'positive',
        text: 'Uses appropriately cautious language'
      });
    }
    
    // 8. Check for excessive certainty
    const certaintyClaims = /(absolutely|definitely|undoubtedly|without question|100 percent|guaranteed|proven fact|irrefutable)/i;
    if (certaintyClaims.test(normalizedText)) {
      score -= 8;
      factors.push({
        type: 'negative',
        text: 'Makes claims of absolute certainty'
      });
    }
    
    // 9. General readability check (simple heuristic)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = text.length / Math.max(sentences.length, 1);
    
    if (avgSentenceLength > 100) {
      score -= 5;
      factors.push({
        type: 'negative',
        text: 'Complex sentence structure may obscure meaning'
      });
    }
    
    // 10. Check for academic/technical terms (indicates expertise)
    const academicTerms = /(methodology|analysis|hypothesis|conclusion|investigation|evidence-based|peer-reviewed|correlation|causation|significant|variable)/i;
    if (academicTerms.test(normalizedText)) {
      score += 7;
      factors.push({
        type: 'positive',
        text: 'Uses technical or academic language'
      });
    }
    
    // 11. Check for clickbait title patterns
    const clickbaitPatterns = /(top \d+|what happens next|won\'t believe|changed my life|mind-blowing|trending now|gone wrong)/i;
    if (clickbaitPatterns.test(normalizedText.substring(0, 500))) {  // Check mainly in the beginning
      score -= 12;
      factors.push({
        type: 'negative',
        text: 'Contains clickbait-style patterns'
      });
    }
    
    // 12. Check for date references (timeliness)
    const datePatterns = /(january|february|march|april|may|june|july|august|september|october|november|december|yesterday|today|last week|this week)/i;
    if (datePatterns.test(normalizedText)) {
      score += 5;
      factors.push({
        type: 'positive',
        text: 'Includes temporal references for context'
      });
    }
    
    // Add neutral information factor
    factors.push({
      type: 'neutral',
      text: 'Analysis uses text patterns to estimate credibility'
    });
    
    // Ensure score is within 0-100 range
    score = Math.max(0, Math.min(100, score));
    
    return {
      score: Math.round(score),
      factors
    };
  };