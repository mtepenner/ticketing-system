# AI Ticketing System 🚀

A modern, intelligent ticketing application that transforms messy, unstructured user input into professional engineering tickets. Using the power of Gemini 1.5 Flash, the system handles the heavy lifting of categorization, prioritization, and formatting, allowing teams to focus on building.

## Table of Contents

  * [Features](https://www.google.com/search?q=%23features)
  * [Technologies Used](https://www.google.com/search?q=%23technologies-used)
  * [Installation](https://www.google.com/search?q=%23installation)
  * [Usage](https://www.google.com/search?q=%23usage)
  * [Project Structure](https://www.google.com/search?q=%23project-structure)
  * [License](https://www.google.com/search?q=%23license)

## Features 🌟

  * **Magic Input**: Submit bugs or features in plain English; the AI automatically extracts the title, description, type, and priority.
  * **Semantic Search**: Uses vector embeddings (pgvector) to detect potential duplicate tickets before they are created.
  * **Interactive Kanban Board**: Drag-and-drop interface for managing ticket lifecycles from Backlog to Done.
  * **Slack Integration**: Built-in webhook support to capture requests directly from team conversations.
  * **Auto-Prioritization**: Intelligent assessment of request urgency based on user sentiment and context.

## Technologies Used 🛠️

### Backend

  * **FastAPI**: High-performance Python web framework.
  * **Google Gemini API**: Generative AI for ticket parsing and text embeddings.
  * **SQLAlchemy & PostgreSQL**: Robust data persistence with vector similarity support via `pgvector`.
  * **Alembic**: Database migrations management.

### Frontend

  * **Next.js 14**: React framework with App Router.
  * **Tailwind CSS**: Utility-first styling for a clean, modern UI.
  * **Zustand**: Lightweight state management for the sprint board.
  * **@hello-pangea/dnd**: Accessible drag-and-drop functionality.

## Installation 💻

### Prerequisites

  * Docker and Docker Compose
  * Python 3.10+
  * Node.js 18+
  * Gemini API Key

### Setup Steps

1.  **Clone the repository**
2.  **Database Setup** (using Docker):
    ```bash
    docker-compose up -d
    ```
    *Note: This starts a PostgreSQL instance with the `pgvector` extension.*
3.  **Backend Setup**:
    ```bash
    cd backend
    pip install -r requirements.txt
    # Create a .env file with DATABASE_URL and GEMINI_API_KEY
    python main.py
    ```
4.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## Usage 📖

1.  **Create a Ticket**: Navigate to the Dashboard or Sprint Board and type a request like: *"The checkout page crashes when users try to apply a discount code."*
2.  **AI Processing**: The system will call the Gemini API to generate a structured ticket.
3.  **Manage Workflow**: Drag the resulting ticket through the Kanban columns as work progresses.
4.  **View All**: Use the "All Tickets" list view for a dense, searchable overview of the system state.

## Project Structure 📂

  * `/backend`: FastAPI application, AI service logic, and database models.
  * `/frontend`: Next.js application, Kanban components, and state management.

## License 📄

This project is licensed under the **MIT License**.
