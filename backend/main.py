

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import uvicorn

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

from routes.projects import router as projects_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SUBSYSTEM API",
    description="API for managing cybersecurity assessment projects",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects_router)

print("NEO4J_URI =", os.getenv("NEO4J_URI"))


@app.get("/")
async def root():
    return {
        "message": "SUBSYSTEM API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
