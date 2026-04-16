from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app
from app.schemas.ticket_schema import ParsedTicketData, TicketType, TicketPriority

# Create a synchronous test client
client = TestClient(app)

# We must mock BOTH AI services so we don't hit Gemini or need a live pgvector DB for simple API tests
@patch('app.api.routes.tickets.parse_raw_ticket')
@patch('app.api.routes.tickets.generate_embedding')
def test_create_smart_ticket_endpoint(mock_embed, mock_parse):
    """Test the POST /api/tickets/ endpoint."""
    
    # 1. Setup our mocked AI data
    mock_parse.return_value = ParsedTicketData(
        title="Mocked Feature Request",
        description="A completely mocked description.",
        ticket_type=TicketType.FEATURE,
        priority=TicketPriority.MEDIUM,
        suggested_tags=["frontend"],
        confidence_score=0.8
    )
    
    # Mock a 768-dimensional vector
    mock_embed.return_value = [0.1] * 768 

    # 2. Make the request to our FastAPI app
    payload = {
        "raw_text": "I need a mocked feature request to test the API."
    }
    response = client.post("/api/tickets/", json=payload)

    # 3. Assert the API behaved correctly
    assert response.status_code == 200
    data = response.json()
    
    assert data["title"] == "Mocked Feature Request"
    assert data["type"] == "Feature"
    assert data["priority"] == "Medium"
    assert data["status"] == "Backlog" # Default status
    assert "id" in data # Database UUID was assigned

def test_get_all_tickets_endpoint():
    """Test the GET /api/tickets/ endpoint."""
    response = client.get("/api/tickets/")
    
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_ticket_validation_error():
    """Test that input validation blocks requests that are too short."""
    payload = {
        "raw_text": "too short" # Less than the 10 character minimum we set in the schema
    }
    response = client.post("/api/tickets/", json=payload)
    
    assert response.status_code == 422 # FastAPI validation error
    assert "String should have at least 10 characters" in response.text
