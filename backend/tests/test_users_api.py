from fastapi.testclient import TestClient
from app.main import app

# Create a synchronous test client
client = TestClient(app)

def test_create_user_success():
    """Test that a new user can be registered successfully."""
    payload = {
        "email": "newuser@example.com",
        "full_name": "Jane Doe",
        "password": "supersecurepassword123"
    }
    response = client.post("/api/users/", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "Jane Doe"
    assert "id" in data
    assert data["is_active"] is True

def test_create_user_duplicate_email():
    """Test that registering an existing email returns a 400 error."""
    payload = {
        "email": "duplicate@example.com",
        "full_name": "First User",
        "password": "password123"
    }
    
    # Create the user once
    client.post("/api/users/", json=payload)
    
    # Attempt to create the same user again
    response = client.post("/api/users/", json=payload)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_get_users_list():
    """Test fetching the list of users."""
    response = client.get("/api/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
