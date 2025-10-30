#!/bin/bash

echo "================================"
echo "Project Manager - SvelteKit Setup"
echo "================================"
echo ""

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi
echo "✅ Python 3 found"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi
echo "✅ Node.js found"

# Backend setup
echo ""
echo "Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your Neo4j credentials!"
fi

echo "Installing Python dependencies..."
pip install -r requirements.txt

cd ..

# Frontend setup
echo ""
echo "Setting up SvelteKit frontend..."
cd frontend

echo "Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "⚠️  IMPORTANT: Edit backend/.env with your Neo4j credentials"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  python main.py"
echo ""
echo "Terminal 2 (Frontend - SvelteKit):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
