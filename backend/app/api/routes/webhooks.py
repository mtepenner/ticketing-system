from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.ticket import Ticket
from app.services.ai_parser import parse_raw_ticket
from app.services.embeddings import generate_embedding

router = APIRouter()

@router.post("/slack")
async def slack_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Listens for Slack event webhooks. 
    (Note: A real Slack integration requires verifying the request signature).
    """
    payload = await request.json()
    
    # Slack sends a challenge on initial setup
    if "challenge" in payload:
        return {"challenge": payload["challenge"]}
        
    try:
        # Extract the message text from the Slack event
        event = payload.get("event", {})
        if event.get("type") == "message" and not event.get("bot_id"):
            raw_message = event.get("text")
            
            # Run the AI pipeline
            parsed_data = parse_raw_ticket(raw_message)
            embedding = generate_embedding(parsed_data.description)
            
            new_ticket = Ticket(
                raw_input=raw_message,
                title=parsed_data.title,
                description=parsed_data.description,
                type=parsed_data.ticket_type,
                priority=parsed_data.priority,
                embedding=embedding
            )
            
            db.add(new_ticket)
            db.commit()
            
            # In a real app, you would use the Slack API to reply to the thread 
            # with a link to the newly created ticket.
            return {"status": "Ticket created successfully"}
            
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
        
    return {"status": "ignored"}
