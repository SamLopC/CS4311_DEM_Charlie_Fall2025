# Project Manager - Complete Full-Stack Application

## 📋 Overview

A professional full-stack application for managing cybersecurity assessment projects with a Neo4j graph database backend, Python FastAPI REST API, and React TypeScript frontend.

## ✅ What's Included

### Backend (Python FastAPI)
- ✅ Complete REST API with 14+ endpoints
- ✅ Neo4j database integration
- ✅ Pydantic data validation
- ✅ CORS configuration
- ✅ Connection pooling & retry logic
- ✅ Automatic constraint creation
- ✅ Project CRUD operations
- ✅ Host & Container management
- ✅ Archive/Restore functionality
- ✅ Export/Import as JSON
- ✅ Auto-generated API documentation (Swagger)

### Frontend (React + TypeScript)
- ✅ Modern React 18 with TypeScript
- ✅ Vite build system for fast development
- ✅ React Router for navigation
- ✅ Axios for API communication
- ✅ Lucide React icons
- ✅ Responsive design
- ✅ Custom CSS styling (no external UI library)
- ✅ Type-safe API client
- ✅ Form validation
- ✅ Modal dialogs
- ✅ Loading states
- ✅ Error handling
- ✅ Success/Error notifications

### Database
- ✅ Neo4j graph database
- ✅ Pre-configured connection
- ✅ Unique constraints on nodes
- ✅ Graph relationships (Project → Host → Container)
- ✅ Idempotent UUID generation

## 📁 Project Structure

```
project-manager-app/
├── backend/                    # Python FastAPI Backend
│   ├── models/
│   │   └── Project.py         # Pydantic models (Project, Host, Container)
│   ├── services/
│   │   ├── DatabaseManager.py # Neo4j connection & query execution
│   │   └── ProjectService.py  # Business logic layer
│   ├── routes/
│   │   └── projects.py        # API route handlers
│   ├── main.py                # FastAPI application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment configuration
│   └── .gitignore
│
├── frontend/                   # React TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx     # Main app layout with navigation
│   │   │   ├── ProjectForm.tsx    # Create/Edit project form
│   │   │   └── ProjectList.tsx    # Project table component
│   │   ├── pages/
│   │   │   ├── ProjectsPage.tsx         # Active projects page
│   │   │   ├── ArchivedProjectsPage.tsx # Archived projects page
│   │   │   └── ProjectDetailPage.tsx    # Single project view
│   │   ├── services/
│   │   │   └── api.ts         # API client (Axios)
│   │   ├── types/
│   │   │   └── index.ts       # TypeScript type definitions
│   │   ├── styles/
│   │   │   └── index.css      # Global styles
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env
│   └── .gitignore
│
├── README.md                   # Main documentation
├── QUICKSTART.md              # Quick start guide
├── PROJECT_SUMMARY.md         # This file
├── setup.sh                   # Automated setup script
└── start.sh                   # Start both servers
```

## 🚀 Quick Start

### 1. Setup (One Time)

```bash
cd project-manager-app
./setup.sh
```

### 2. Start the Application

**Option A: Two Terminals**

Terminal 1 (Backend):
```bash
cd backend
python main.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

**Option B: Single Script**
```bash
./start.sh
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 Features

### Project Management
- **Create** - Add new projects with validation
- **Read** - View all projects or single project details
- **Update** - Edit project information
- **Delete** - Remove projects permanently
- **Archive** - Move projects to archive
- **Restore** - Restore archived projects
- **Export** - Download project as JSON
- **Import** - Upload project JSON

### Data Management
- **Add Hosts** - Associate hosts with projects
- **Add Containers** - Link containers to hosts
- **View Topology** - See project infrastructure

### User Interface
- **Responsive Design** - Works on all screen sizes
- **Clean UI** - Professional, modern interface
- **Intuitive Navigation** - Easy to use
- **Real-time Updates** - Instant feedback
- **Error Handling** - Clear error messages
- **Loading States** - Visual feedback during operations

## 🔧 Technology Stack

### Backend
- **FastAPI** 0.115.0 - Modern Python web framework
- **Neo4j** 6.0.2 - Graph database driver
- **Pydantic** 2.12.3 - Data validation
- **Uvicorn** - ASGI server
- **python-dotenv** - Environment management

### Frontend
- **React** 18.3.1 - UI library
- **TypeScript** 5.6.3 - Type safety
- **Vite** 5.4.11 - Build tool
- **React Router** 6.28.0 - Navigation
- **Axios** 1.7.7 - HTTP client
- **Lucide React** 0.263.1 - Icons

### Database
- **Neo4j** - Graph database (cloud instance)

## 📡 API Endpoints

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/{id}` - Get project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `POST /api/projects/{id}/archive` - Archive project
- `POST /api/projects/{id}/restore` - Restore project
- `GET /api/projects/{id}/export` - Export project
- `POST /api/projects/import` - Import project

### Hosts & Containers
- `POST /api/projects/{id}/hosts` - Add host
- `GET /api/projects/{id}/hosts` - Get hosts
- `POST /api/projects/hosts/{ip}/containers` - Add container
- `GET /api/projects/hosts/{ip}/containers` - Get containers

### Utilities
- `GET /` - API info
- `GET /health` - Health check
- `GET /docs` - Swagger documentation

## 🔒 Security Features

- Environment-based configuration
- CORS protection
- Input validation with Pydantic
- SQL injection prevention (parameterized queries)
- Type-safe TypeScript frontend

## 📊 Database Schema

### Nodes
- **Project** - Main project node
  - Properties: id, name, analystInitials, startDate, endDate, eventType, archived
- **Host** - Infrastructure host
  - Properties: ip, port, openPorts
- **Container** - Docker/container
  - Properties: id, name, image, version, hostIp, openPorts

### Relationships
- `(Project)-[:HAS_HOST]->(Host)`
- `(Host)-[:RUNS]->(Container)`

## 🎨 UI Components

### Pages
1. **Projects Page** - List of active projects
2. **Archived Projects Page** - List of archived projects
3. **Project Detail Page** - Detailed project view with hosts

### Components
1. **Layout** - Navigation and page structure
2. **ProjectForm** - Modal form for create/edit
3. **ProjectList** - Table component for projects

## 🧪 Testing the Application

### 1. Create a Project
- Click "New Project"
- Fill in the form
- Click "Create Project"

### 2. View Projects
- See project in the table
- Click project name to view details

### 3. Edit a Project
- Click edit icon
- Modify fields
- Save changes

### 4. Archive a Project
- Click archive icon
- Confirm action
- View in "Archived" tab

### 5. Export/Import
- Click "Export" on project detail page
- Save JSON file
- Use import to restore

## 💡 Design Decisions

### Why FastAPI?
- Fast performance
- Auto-generated API docs
- Built-in validation
- Async support
- Type hints

### Why React + TypeScript?
- Type safety prevents bugs
- Excellent developer experience
- Large ecosystem
- Component reusability

### Why Neo4j?
- Natural for relationship-heavy data
- Flexible schema
- Powerful queries
- Graph visualization potential

### Why Vite?
- Lightning-fast HMR
- Optimized builds
- Simple configuration
- Great DX

## 🔄 Data Flow

```
User → Frontend (React) → API Client (Axios) 
  → Backend (FastAPI) → Service Layer (ProjectService)
  → Database Layer (DatabaseManager) → Neo4j Database
```

## 🛠️ Development Tips

### Backend
```bash
# Run with auto-reload
cd backend
uvicorn main:app --reload

# Test API
curl http://localhost:8000/health
```

### Frontend
```bash
# Development with HMR
cd frontend
npm run dev

# Type check
npm run tsc

# Build production
npm run build
```

## 📝 Environment Variables

### Backend (.env)
```env
NEO4J_URI=neo4j+ssc://725efc0a.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=oiVdGQtciBLztT1v9mTPYw5KpC-_dSBPW0OU60aqfgI
NEO4J_DATABASE=neo4j
BACKEND_PORT=8000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🎓 Learning Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Neo4j Docs**: https://neo4j.com/docs/
- **Vite Docs**: https://vitejs.dev/

## ✨ What Makes This Special

1. **Complete Stack** - Everything you need in one repo
2. **Production Ready** - Proper error handling, validation, loading states
3. **Type Safe** - TypeScript throughout frontend
4. **Clean Code** - Well-organized, commented, maintainable
5. **Modern Tools** - Latest versions of all libraries
6. **Easy Setup** - Automated scripts for quick start
7. **Graph Database** - Powerful Neo4j integration
8. **RESTful API** - Clean, documented endpoints
9. **Responsive UI** - Works on all devices
10. **Best Practices** - Following industry standards

## 🎯 Next Steps

1. Run the setup script
2. Start both servers
3. Open the application
4. Create your first project
5. Explore the features
6. Check out the API docs
7. Customize for your needs

## 📄 License

MIT License - Feel free to use for any purpose

---

**Built with ❤️ using FastAPI, React, TypeScript, and Neo4j**
