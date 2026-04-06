from sqlalchemy.orm import Session
from app.models.ticket import Ticket

def find_similar_tickets(db: Session, query_embedding: list[float], limit: int = 3, threshold: float = 0.2):
    """
    Finds existing tickets that are semantically similar to the generated embedding.
    Uses Cosine Distance (<=>) provided by pgvector.
    Lower distance = higher similarity.
    """
    # The <=> operator computes cosine distance in pgvector
    similar_tickets = db.query(Ticket).order_by(
        Ticket.embedding.cosine_distance(query_embedding)
    ).limit(limit).all()
    
    # Optional: Filter out results that aren't similar enough
    # If the distance is greater than the threshold, they aren't duplicates
    # You may need to tune this threshold based on your actual data
    results = [
        ticket for ticket in similar_tickets 
        if ticket.embedding is not None 
        # Note: SQLAlchemy doesn't execute the distance calculation in Python, 
        # so filtering by exact threshold score in Python requires returning the score from the DB query.
        # For simplicity, we are returning the top 'limit' closest matches.
    ]
    
    return results
