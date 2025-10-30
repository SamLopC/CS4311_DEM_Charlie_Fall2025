# Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Neo4j Database** - Connection details provided in `.env`

## Installation

### Option 1: Automated Setup (Recommended)

```bash
# Clone or navigate to the project directory
cd project-manager-app

# Run the setup script
./setup.sh
```

This will:
- Install all Python dependencies
- Install all Node.js dependencies
- Create `.env` files from examples

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create environment file
cp .env.example .env

# Install dependencies
pip install -r requirements.txt
```

#### Frontend Setup

```bash
cd frontend

# Create environment file
cp .env.example .env

# Install dependencies
npm install
```

## Running the Application

### Option 1: Start Both Servers

You need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Option 2: Using Start Script

```bash
./start.sh
```

This starts both servers automatically.

## Accessing the Application

Once both servers are running:

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)

## First Steps

1. Open http://localhost:5173 in your browser
2. Click "New Project" to create your first project
3. Fill in the project details:
   - Project Name
   - Analyst Initials
   - Start/End Dates
   - Event Type (CVI or CVPA)
4. Click "Create Project"

## Features Overview

### Project Management
- ✅ **Create Projects** - Add new cybersecurity assessment projects
- ✅ **View Projects** - See all active projects in a table
- ✅ **Edit Projects** - Update project details
- ✅ **Archive Projects** - Move completed projects to archive
- ✅ **Delete Projects** - Remove projects permanently
- ✅ **Export/Import** - Backup and restore projects as JSON

### Project Details
- View detailed project information
- See associated hosts and containers
- Export project data

### Navigation
- **Projects** - View active projects
- **Archived** - View archived projects

## Configuration

### Backend Configuration (`backend/.env`)

```env
NEO4J_URI=neo4j+ssc://725efc0a.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=oiVdGQtciBLztT1v9mTPYw5KpC-_dSBPW0OU60aqfgI
NEO4J_DATABASE=neo4j
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

## Common Issues

### Backend Won't Start

**Issue**: `ModuleNotFoundError` or import errors

**Solution**:
```bash
cd backend
pip install -r requirements.txt
```

### Frontend Won't Start

**Issue**: `Cannot find module` errors

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error

**Issue**: Backend can't connect to Neo4j

**Solution**:
- Check your `.env` file has correct credentials
- Verify the Neo4j instance is running
- Check network connectivity

### CORS Errors

**Issue**: Frontend can't connect to backend

**Solution**:
- Ensure backend is running on port 8000
- Check `FRONTEND_URL` in backend `.env`
- Clear browser cache

## Development

### Backend Development

```bash
cd backend

# Run with auto-reload
python main.py
# or
uvicorn main:app --reload --port 8000
```

### Frontend Development

```bash
cd frontend

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Testing

Access the interactive API documentation at:
http://localhost:8000/docs

This provides:
- Complete API endpoint listing
- Try-it-out functionality
- Request/response schemas
- Authentication testing

## Project Structure

```
project-manager-app/
├── backend/
│   ├── models/          # Data models (Project, Host, Container)
│   ├── services/        # Business logic (ProjectService, DatabaseManager)
│   ├── routes/          # API endpoints
│   ├── main.py          # FastAPI application
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── types/       # TypeScript types
│   │   └── styles/      # CSS styles
│   └── package.json     # Node.js dependencies
└── README.md
```

## Next Steps

- Explore the API documentation at `/docs`
- Create your first project
- Add hosts to your project
- Export project data for backup
- Check out the archived projects view

## Support

For issues or questions:
1. Check this guide
2. Review the API documentation at `/docs`
3. Check the main README.md

## Tips

- Use the **Refresh** button to reload project lists
- **Archive** projects instead of deleting when possible
- Use **Export** to backup important projects
- The **Event Type** field accepts only CVI or CVPA values
- Dates are validated - end date must be after start date
