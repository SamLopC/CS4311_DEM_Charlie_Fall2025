# Project Manager Application

A full-stack application for managing cybersecurity assessment projects with Neo4j database backend.

## Architecture

- **Backend**: Python FastAPI REST API
- **Frontend**: React + TypeScript + Vite
- **Database**: Neo4j Graph Database

## Project Structure

```
project-manager-app/
├── backend/                 # Python FastAPI backend
│   ├── models/             # Pydantic models
│   ├── services/           # Business logic
│   ├── routes/             # API endpoints
│   └── main.py             # FastAPI app
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- Neo4j Database (connection details in `.env`)

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
NEO4J_URI=neo4j+ssc://725efc0a.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=oiVdGQtciBLztT1v9mTPYw5KpC-_dSBPW0OU60aqfgI
NEO4J_DATABASE=neo4j
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

COMMAND CLICK BELOW ON DOCUMENTATION TO TEST

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs` or `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Features

### Project Management
- ✅ Create new projects with validation
- ✅ View all active projects
- ✅ Edit project details
- ✅ Archive/restore projects
- ✅ Delete projects
- ✅ Export/import projects

### Host & Container Management
- ✅ Add hosts to projects
- ✅ Add containers to hosts
- ✅ View project topology

## API Endpoints

### Projects
- `POST /api/projects` - Create new project
- `GET /api/projects` - List all projects
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/archive` - Archive project
- `POST /api/projects/{id}/restore` - Restore archived project
- `GET /api/projects/{id}/export` - Export project
- `POST /api/projects/import` - Import project

### Hosts
- `POST /api/projects/{id}/hosts` - Add host to project
- `GET /api/projects/{id}/hosts` - Get project hosts

### Containers
- `POST /api/hosts/{ip}/containers` - Add container to host
- `GET /api/hosts/{ip}/containers` - Get host containers

## Development

### Backend Development
```bash
cd backend
# Run with auto-reload
uvicorn main:app --reload --port 8000
```

### Frontend Development
```bash
cd frontend
# Run with hot module replacement
npm run dev
```

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Build for Production

### Backend
```bash
cd backend
# Backend runs directly with Python
python main.py
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

## License

MIT License
