from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from app.models.ticket import TicketType, TicketPriority, TicketStatus

# Input from the user (the raw text)
class TicketCreateRequest(BaseModel):
    raw_text: str = Field(..., min_length=10, description="The unstructured request from the user")

# Output from the AI Service
class ParsedTicketData(BaseModel):
    title: str
    description: str
    ticket_type: TicketType
    priority: TicketPriority
    suggested_tags: List[str] = []
    confidence_score: float

# Output to the Frontend
class TicketResponse(BaseModel):
    id: UUID
    title: str
    description: str
    type: TicketType
    priority: TicketPriority
    status: TicketStatus

# Add this below your other schemas in ticket_schema.py
class TicketUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[TicketType] = None
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None
    
    class Config:
        from_attributes = True
