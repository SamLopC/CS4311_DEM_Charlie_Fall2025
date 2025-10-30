# Project Manager - SvelteKit Edition

A full-stack application for managing cybersecurity assessment projects with **SvelteKit frontend** and Python FastAPI backend.

## 🎯 What Changed

**Old Frontend**: React + TypeScript  
**New Frontend**: SvelteKit + TypeScript ✨

**Backend**: Same Python FastAPI (no changes needed)

## 📦 Tech Stack

### Frontend
- **SvelteKit** - Modern, fast web framework
- **TypeScript** - Type safety
- **Lucide Svelte** - Icon components
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **FastAPI** - Python REST API
- **Neo4j** - Graph database
- **Pydantic** - Data validation

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Neo4j database access

### Installation

#### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npx svelte-kit sync
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
# or
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Project Structure

```
project-manager-sveltekit/
├── backend/                    # Python FastAPI Backend
│   ├── models/                # Pydantic models
│   ├── services/              # Business logic
│   ├── routes/                # API endpoints
│   └── main.py               # FastAPI app
│
├── frontend/                  # SvelteKit Frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/   # Svelte components
│   │   │   ├── services/     # API client
│   │   │   └── types/        # TypeScript types
│   │   ├── routes/           # SvelteKit routes
│   │   │   ├── +layout.svelte       # Main layout
│   │   │   ├── +page.svelte         # Home (projects)
│   │   │   ├── archived/            # Archived projects
│   │   │   └── projects/[id]/       # Project detail
│   │   ├── app.css           # Global styles
│   │   └── app.html          # HTML template
│   ├── package.json
│   ├── svelte.config.js
│   └── vite.config.ts
│
└── README.md
```

## ✨ Features

### Project Management
- ✅ Create, read, update, delete projects
- ✅ Archive and restore projects
- ✅ Export projects as JSON
- ✅ View project details
- ✅ Manage hosts and containers

### User Interface
- ✅ Clean, modern SvelteKit UI
- ✅ Reactive components
- ✅ Modal forms
- ✅ Loading states
- ✅ Error handling
- ✅ Success notifications
- ✅ Responsive design

## 🎨 SvelteKit Benefits

### Why SvelteKit?

1. **Better Performance** - Smaller bundle sizes, faster load times
2. **Simpler Code** - Less boilerplate than React
3. **Built-in Routing** - File-based routing system
4. **SSR Ready** - Server-side rendering support
5. **Better DX** - More intuitive, less complex

### Code Comparison

**React Component:**
```tsx
const [count, setCount] = useState(0);

return (
  <button onClick={() => setCount(count + 1)}>
    Clicked {count} times
  </button>
);
```

**Svelte Component:**
```svelte
<script>
  let count = 0;
</script>

<button on:click={() => count += 1}>
  Clicked {count} times
</button>
```

## 🔧 Development

### Frontend Development
```bash
cd frontend

# Development server with HMR
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
cd backend

# Run with auto-reload
uvicorn main:app --reload --port 8000
```

## 📝 Key Files

### Frontend Components
- `+layout.svelte` - Main app layout with navigation
- `+page.svelte` - Home page (active projects)
- `archived/+page.svelte` - Archived projects page
- `projects/[id]/+page.svelte` - Project detail page
- `ProjectForm.svelte` - Create/edit modal
- `ProjectList.svelte` - Project table component

### Backend (Same as Before)
- `main.py` - FastAPI application
- `services/ProjectService.py` - Business logic (FIXED VERSION)
- `services/DatabaseManager.py` - Neo4j connection
- `routes/projects.py` - API endpoints
- `models/Project.py` - Data models

## 🔄 Migration from React

If you're coming from the React version:

### What's the Same
- ✅ All backend code (Python/FastAPI)
- ✅ Database structure (Neo4j)
- ✅ API endpoints
- ✅ Features and functionality
- ✅ Styling (same CSS)

### What's Different
- ❌ React → SvelteKit
- ❌ JSX → Svelte syntax
- ❌ useState/useEffect → Svelte stores/reactive statements
- ❌ React Router → SvelteKit routing

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check .env file exists
cd backend
cat .env

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Won't Start
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues
- Verify Neo4j credentials in `backend/.env`
- Check Neo4j instance is running
- Test connection at http://localhost:8000/health

## 📚 Documentation

### SvelteKit
- https://kit.svelte.dev/docs

### Svelte
- https://svelte.dev/docs

### FastAPI
- https://fastapi.tiangolo.com/

### Neo4j
- https://neo4j.com/docs/

## 🎯 Next Steps

1. **Setup**: Follow installation steps
2. **Run**: Start backend and frontend
3. **Explore**: Create projects and test features
4. **Customize**: Modify components as needed
5. **Deploy**: Build for production

## 💡 Tips

- SvelteKit uses file-based routing
- Components are `.svelte` files
- Reactivity is automatic (no useState needed)
- Use `$:` for reactive statements
- TypeScript support is built-in

## ✅ Production Build

```bash
# Backend
cd backend
python main.py

# Frontend
cd frontend
npm run build
npm run preview
```

## 📄 License

MIT License

---

**Built with ❤️ using SvelteKit, TypeScript, FastAPI, and Neo4j**
