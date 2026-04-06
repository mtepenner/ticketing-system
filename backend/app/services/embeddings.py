import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Ensure Gemini is configured
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_embedding(text: str) -> list[float]:
    """
    Converts a string of text into a vector embedding using Gemini.
    """
    try:
        # text-embedding-004 is Google's latest embedding model 
        # It outputs a vector of 768 dimensions by default
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document",
        )
        return result['embedding']
    except Exception as e:
        raise ValueError(f"Failed to generate embedding: {str(e)}")
