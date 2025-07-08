#!/bin/bash

echo "Starting ShopMind Application..."
echo
echo "This script will start both backend and frontend servers."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js is installed."
echo

# Navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if the current directory is correct
if [ ! -f package.json ]; then
    echo "Error: Cannot find package.json in current directory."
    echo "Please run this script from the project root."
    exit 1
fi

echo "Starting backend server..."
echo

# Start backend server in a new terminal window
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '"$SCRIPT_DIR"' && echo Starting SmartCart backend server... && npm install && node simple-server.js"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$SCRIPT_DIR' && echo Starting SmartCart backend server... && npm install && node simple-server.js; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$SCRIPT_DIR' && echo Starting SmartCart backend server... && npm install && node simple-server.js; exec bash" &
    else
        echo "Error: Could not find a suitable terminal emulator."
        exit 1
    fi
else
    echo "Unsupported OS. Please start the servers manually."
    exit 1
fi

echo "Waiting for backend to initialize..."
sleep 5

echo
echo "Starting frontend server..."
echo

# Navigate to frontend directory
cd frontend

# Check if the frontend directory is correct
if [ ! -f package.json ]; then
    echo "Error: Cannot find frontend package.json."
    echo "Please check directory structure."
    exit 1
fi

# Start frontend server in a new terminal window
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    osascript -e 'tell app "Terminal" to do script "cd '"$SCRIPT_DIR"'/frontend && echo Starting SmartCart frontend... && npm install && npm start"'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$SCRIPT_DIR/frontend' && echo Starting SmartCart frontend... && npm install && npm start; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$SCRIPT_DIR/frontend' && echo Starting SmartCart frontend... && npm install && npm start; exec bash" &
    else
        echo "Error: Could not find a suitable terminal emulator."
        exit 1
    fi
fi

echo
echo "Both servers are starting..."
echo
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Please wait a moment for both servers to fully start."
echo
echo "Press Enter to exit this window (servers will continue running)..."

read
