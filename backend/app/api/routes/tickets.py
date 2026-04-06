from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.ticket_schema import TicketCreateRequest, TicketResponse
from app.models.ticket import Ticket
from app.services.ai_parser import parse_raw_ticket
from app.services.embeddings import generate_embedding
from app.services.similarity import find_similar_tickets

router = APIRouter()

@router.get("/", response_model=List[TicketResponse])
def get_all_tickets(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    """Retrieve all tickets for the board."""
    tickets = db.query(Ticket).offset(skip).limit(limit).all()
    return tickets

@router.post("/", response_model=TicketResponse)
def create_smart_ticket(request: TicketCreateRequest, db: Session = Depends(get_db)):
    """Parse raw text, generate an embedding, and create a ticket."""
    try:
        # 1. AI Parsing
        parsed_data = parse_raw_ticket(request.raw_text)
        
        # 2. Generate Embedding from the description to check for duplicates later
        embedding = generate_embedding(parsed_data.description)
        
        # 3. Save to DB
        new_ticket = Ticket(
            raw_input=request.raw_text,
            title=parsed_data.title,
            description=parsed_data.description,
            type=parsed_data.ticket_type,
            priority=parsed_data.priority,
            ai_confidence_score=parsed_data.confidence_score,
            embedding=embedding 
        )
        
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)
        
        return new_ticket
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/check-duplicates", response_model=List[TicketResponse])
def check_duplicates(request: TicketCreateRequest, db: Session = Depends(get_db)):
    """
    Accepts raw text, generates a temporary embedding, and returns 
    similar existing tickets without saving anything.
    """
    try:
        query_embedding = generate_embedding(request.raw_text)
        similar_tickets = find_similar_tickets(db, query_embedding)
        return similar_tickets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
