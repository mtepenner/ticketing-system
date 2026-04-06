# AI Ticketing System Makefile
# Run `make help` to see all available commands.

# Variables
BACKEND_DIR = backend
FRONTEND_DIR = frontend

.PHONY: install install-backend install-frontend db-up dev-backend dev-frontend help

# Default target
help:
	@echo "================================================="
	@echo "🎫 AI Ticketing System - Setup & Dev Commands"
	@echo "================================================="
	@echo "make install         - Installs ALL backend and frontend dependencies"
	@echo "make install-backend - Sets up Python venv and installs FastAPI/AI packages"
	@echo "make install-frontend- Installs Next.js, React, and UI packages via npm"
	@echo "make db-up           - Starts the PostgreSQL (pgvector) database via Docker"
	@echo "make dev-backend     - Runs the FastAPI development server on port 8000"
	@echo "make dev-frontend    - Runs the Next.js development server on port 3000"

# --- INSTALLATION TARGETS ---

install: install-backend install-frontend
	@echo "🎉 All dependencies successfully installed!"

install-backend:
	@echo "⚙️ Setting up Python backend environment..."
	@mkdir -p $(BACKEND_DIR)
	@cd $(BACKEND_DIR) && python3 -m venv venv
	@echo "📦 Installing pip dependencies..."
	@bash -c "source $(BACKEND_DIR)/venv/bin/activate && \
		pip install --upgrade pip && \
		pip install \
		fastapi==0.110.0 \
		uvicorn==0.29.0 \
		sqlalchemy==2.0.29 \
		psycopg2-binary==2.9.9 \
		pgvector==0.2.5 \
		pydantic==2.6.4 \
		pydantic-settings==2.2.1 \
		google-generativeai==0.4.1 \
		python-dotenv==1.0.1 \
		passlib[bcrypt]==1.7.4 \
		python-jose[cryptography]==3.3.0 \
		alembic"
	@echo "✅ Backend dependencies installed."

install-frontend:
	@echo "⚙️ Setting up Next.js frontend environment..."
	@mkdir -p $(FRONTEND_DIR)
	@echo "📦 Installing npm dependencies..."
	@cd $(FRONTEND_DIR) && npm install \
		@hello-pangea/dnd \
		axios \
		clsx \
		lucide-react \
		next \
		react \
		react-dom \
		tailwind-merge \
		zustand
	@echo "📦 Installing npm dev dependencies..."
	@cd $(FRONTEND_DIR) && npm install -D \
		@types/node \
		@types/react \
		@types/react-dom \
		autoprefixer \
		eslint \
		eslint-config-next \
		postcss \
		tailwindcss \
		typescript
	@echo "✅ Frontend dependencies installed."


# --- RUN TIME TARGETS ---

db-up:
	@echo "🐳 Starting PostgreSQL database..."
	docker-compose up -d

dev-backend:
	@echo "🚀 Starting FastAPI server..."
	@bash -c "source $(BACKEND_DIR)/venv/bin/activate && cd $(BACKEND_DIR) && uvicorn main:app --reload"

dev-frontend:
	@echo "🚀 Starting Next.js server..."
	@cd $(FRONTEND_DIR) && npm run dev
