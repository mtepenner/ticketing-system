from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import tickets
from app.db.database import engine, Base

# Create database tables (In production, use Alembic migrations instead of this)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Ticketing System",
    description="A smart ticketing backend powered by FastAPI and Gemini",
    version="1.0.0"
)

# Configure CORS so your Next.js frontend can communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(tickets.router, prefix="/api/tickets", tags=["Tickets"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}
