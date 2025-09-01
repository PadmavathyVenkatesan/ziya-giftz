#!/bin/bash

echo "Starting Ziya Giftz Development Server..."
echo "=================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting Angular development server..."
ng serve --open --port 4200

echo "Server should be running at http://localhost:4200"
