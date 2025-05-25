#!/bin/bash

# Employee Label Printer - Production Server Launcher
# Compatible with Linux and macOS

echo ""
echo "========================================"
echo "  Employee Label Printer"
echo "  Production Server Launcher"
echo "========================================"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ ERROR: Node.js is not installed or not in PATH"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Minimum version required: 14.0.0"
    echo ""
    echo "Installation instructions:"
    echo "  Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "  CentOS/RHEL:   sudo yum install nodejs npm"
    echo "  macOS:         brew install node"
    echo ""
    echo "After installing Node.js, restart this script."
    echo ""
    exit 1
fi

# Display Node.js version
echo "✅ Node.js version:"
node --version
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/server"
APP_DIR="$SCRIPT_DIR/app"

# Change to the server directory
cd "$SERVER_DIR" || {
    echo "❌ ERROR: Cannot access server directory: $SERVER_DIR"
    exit 1
}

# Check if server files exist
if [ ! -f "server.js" ]; then
    echo "❌ ERROR: Server files not found!"
    echo "Please ensure server.js exists in the server folder."
    echo ""
    exit 1
fi

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "❌ ERROR: Application files not found!"
    echo "Please ensure the app folder exists."
    echo ""
    exit 1
fi

echo "🚀 Starting Employee Label Printer Server..."
echo ""
echo "The application will open in your default browser."
echo "If it doesn't open automatically, navigate to: http://localhost:3000"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

# Function to handle cleanup on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down server..."
    exit 0
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGINT SIGTERM

# Start the server
node server.js

# If we get here, the server stopped
echo ""
echo "✅ Server stopped."
