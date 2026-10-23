#!/bin/bash
# DleafTech CRM - Linux/macOS Launcher

echo "====================================================================="
echo "          DLEAFTECH ENTERPRISE CRM - LOCAL LAUNCHER"
echo "====================================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/3] Setting up Backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo "[2/3] Setting up Frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo "[3/3] Launching Full-Stack Services..."
echo "📡 Backend URL:   http://localhost:5000/api/health"
echo "💻 Frontend URL:  http://localhost:3000"
echo "====================================================================="

# Start backend in background
(cd backend && npm run dev) &
BACKEND_PID=$!

# Start frontend
(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
