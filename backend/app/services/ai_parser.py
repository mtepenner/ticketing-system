import os
import json
import google.generativeai as genai
from app.schemas.ticket_schema import ParsedTicketData
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini SDK
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use the fast, cost-effective Flash model
model = genai.GenerativeModel('gemini-1.5-flash')

def parse_raw_ticket(raw_text: str) -> ParsedTicketData:
    """
    Takes messy user input and returns structured JSON using Gemini.
    """
    prompt = f"""
    You are an expert product manager and agile master. 
    Analyze the following user input and convert it into a structured engineering ticket.
    
    User Input: "{raw_text}"
    
    Respond EXACTLY with a JSON object matching this schema. Do not include markdown code blocks (like ```json), just the raw JSON:
    {{
        "title": "A concise, actionable title",
        "description": "A well-formatted markdown description explaining the issue or feature.",
        "ticket_type": "Bug" | "Feature" | "Chore",
        "priority": "Low" | "Medium" | "High" | "Critical",
        "suggested_tags": ["list", "of", "tags"],
        "confidence_score": 0.0 to 1.0 (How confident are you in this parsing? If ambiguous, score lower.)
    }}
    """
    
    # Generate the response, enforcing a JSON output structure
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
        )
    )
    
    # Parse the returned JSON string into our Pydantic schema
    try:
        data_dict = json.loads(response.text)
        return ParsedTicketData(**data_dict)
    except Exception as e:
        # In production, handle this gracefully or trigger a retry
        raise ValueError(f"Failed to parse AI response: {str(e)}")
