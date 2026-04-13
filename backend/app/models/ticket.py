import uuid
import enum
from sqlalchemy import Column, String, Text, Enum, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.db.database import Base

class TicketType(str, enum.Enum):
    BUG = "Bug"
    FEATURE = "Feature"
    CHORE = "Chore"

class TicketPriority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class TicketStatus(str, enum.Enum):
    BACKLOG = "Backlog"
    IN_PROGRESS = "In Progress"
    REVIEW = "Review"
    DONE = "Done"

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    raw_input = Column(Text, nullable=False)
    title = Column(String, index=True)
    description = Column(Text)
    type = Column(Enum(TicketType), default=TicketType.FEATURE)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM)
    status = Column(Enum(TicketStatus), default=TicketStatus.BACKLOG)
    
    # Fixed: Added missing ForeignKey import and uses string reference "users.id"
    assignee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    assignee = relationship("User", back_populates="tickets")
    
    # 768 is the standard dimension size for many embedding models
    embedding = Column(Vector(768)) 
    ai_confidence_score = Column(Float, default=1.0)
