from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.ticket_schema import TicketCreateRequest, TicketResponse
from app.models.ticket import Ticket
from app.services.ai_parser import parse_raw_ticket

router = APIRouter()

@router.post("/", response_model=TicketResponse)
def create_smart_ticket(request: TicketCreateRequest, db: Session = Depends(get_db)):
    try:
        # 1. Send the raw text to Gemini to get structured data
        parsed_data = parse_raw_ticket(request.raw_text)
        
        # 2. (Optional Future Step) Generate Vector Embedding for `request.raw_text` here
        # embedding = generate_embedding(request.raw_text)
        
        # 3. Create the Database Record
        new_ticket = Ticket(
            raw_input=request.raw_text,
            title=parsed_data.title,
            description=parsed_data.description,
            type=parsed_data.ticket_type,
            priority=parsed_data.priority,
            ai_confidence_score=parsed_data.confidence_score
            # embedding=embedding 
        )
        
        db.add(new_ticket)
        db.commit()
        db.refresh(new_ticket)
        
        return new_ticket
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
