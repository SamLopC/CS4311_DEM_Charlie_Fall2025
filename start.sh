#!/bin/bash

#  SUBSYSTEM Start Script
# This script starts both backend and frontend in separate terminal windows

echo "Starting SUBSYSTEM ..."
echo ""

# Start backend
echo "Starting backend server..."
cd backend
python main.py &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend development server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================"
echo "🚀 Application Started!"
echo "================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
