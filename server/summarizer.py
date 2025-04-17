import logging
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for models
bart_tokenizer = None
bart_model = None

def load_bart_model():
    """Load the BART-large-CNN model"""
    global bart_tokenizer, bart_model
    
    logger.info("Loading BART-large-CNN model...")
    
    try:
        # Load tokenizer and model
        bart_tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
        bart_model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
        
        # Move model to GPU if available
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        bart_model.to(device)
        
        logger.info(f"BART model loaded successfully (device: {device})")
        return True
    
    except Exception as e:
        logger.error(f"Error loading BART model: {str(e)}")
        return False

def extract_sentences(text, num_sentences=5):
    """Simple extractive summarization as fallback"""
    # Split text into sentences
    sentences = text.replace('!', '.').replace('?', '.').split('.')
    sentences = [s.strip() for s in sentences if s.strip()]
    
    # Simple scoring - favor sentences at the beginning with a bit of weight for longer sentences
    scored_sentences = [(i, len(s.split()) / 5) for i, s in enumerate(sentences)]
    scored_sentences.sort(key=lambda x: (-1 if x[0] < 3 else 1) * x[1], reverse=True)
    
    # Get top sentences and sort them by original order
    top_indices = [x[0] for x in scored_sentences[:min(num_sentences, len(sentences))]]
    top_indices.sort()
    
    # Join selected sentences
    summary = '. '.join([sentences[i] for i in top_indices])
    return summary + ('.' if not summary.endswith('.') else '')

def generate_summary(text, model_type="bart", max_length=150):
    """Generate summary for the given text"""
    global bart_tokenizer, bart_model
    
    # Preprocess text (remove excessive whitespace)
    text = ' '.join(text.split())
    
    if model_type.lower() == "bart":
        # Ensure model is loaded
        if bart_tokenizer is None or bart_model is None:
            success = load_bart_model()
            if not success:
                logger.warning("Falling back to extractive summarization")
                return extract_sentences(text)
        
        try:
            # Generate summary with BART
            device = next(bart_model.parameters()).device
            inputs = bart_tokenizer(text, return_tensors="pt", max_length=1024, truncation=True).to(device)
            
            # Generate summary
            summary_ids = bart_model.generate(
                inputs["input_ids"], 
                num_beams=4,
                min_length=30,
                max_length=max_length,
                early_stopping=True
            )
            
            # Decode summary
            summary = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
            return summary
        
        except Exception as e:
            logger.error(f"Error generating summary with BART: {str(e)}")
            logger.warning("Falling back to extractive summarization")
            return extract_sentences(text)
    
    else:
        # Fallback to extractive summarization
        logger.info("Using extractive summarization")
        return extract_sentences(text)

# Load model at module import time (can be commented out if you want to lazy-load)
load_bart_model()