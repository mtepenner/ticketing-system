import pytest
from unittest.mock import patch
from app.services.ai_parser import parse_raw_ticket
from app.schemas.ticket_schema import TicketType, TicketPriority

# We patch the exact function where the API call happens
@patch('app.services.ai_parser.model.generate_content')
def test_parse_raw_ticket_success(mock_generate_content):
    """Test that the parser successfully converts AI JSON into our Pydantic model."""
    
    # 1. Setup the Mock Response to simulate what Gemini would return
    class MockResponse:
        text = """
        {
            "title": "Fix Stripe Checkout 500 Error",
            "description": "Users are reporting a 500 internal server error when clicking 'Pay'.",
            "ticket_type": "Bug",
            "priority": "Critical",
            "suggested_tags": ["stripe", "payments", "backend"],
            "confidence_score": 0.95
        }
        """
    mock_generate_content.return_value = MockResponse()

    # 2. Execute the function
    raw_input = "Hey, checkout is broken again. Getting a 500 error on the Stripe page."
    result = parse_raw_ticket(raw_input)

    # 3. Assert the Pydantic model was constructed correctly
    assert result.title == "Fix Stripe Checkout 500 Error"
    assert result.ticket_type == TicketType.BUG
    assert result.priority == TicketPriority.CRITICAL
    assert "stripe" in result.suggested_tags
    assert result.confidence_score == 0.95

@patch('app.services.ai_parser.model.generate_content')
def test_parse_raw_ticket_malformed_json(mock_generate_content):
    """Test that the system gracefully handles bad AI outputs."""
    
    class MockResponse:
        text = "This is not valid JSON."
    mock_generate_content.return_value = MockResponse()

    with pytest.raises(ValueError, match="Failed to parse AI response"):
        parse_raw_ticket("Make a button.")
