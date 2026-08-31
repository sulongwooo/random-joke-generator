#!/bin/bash
# Random Joke Generator - Quick Start Script

echo "🎉 Random Joke Generator - Quick Start"
echo "======================================"
echo ""

# Check if Python is installed
if command -v python3 &> /dev/null; then
    echo "✅ Starting local server with Python..."
    echo "🌐 Opening http://localhost:8000 in your browser"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    # Open browser based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8000
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open http://localhost:8000 2>/dev/null || echo "Please open http://localhost:8000 in your browser"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        start http://localhost:8000
    fi
    
    # Start Python HTTP server
    python3 -m http.server 8000 --directory .
    
elif command -v python &> /dev/null; then
    echo "✅ Starting local server with Python 2..."
    echo "🌐 Opening http://localhost:8000 in your browser"
    python -m SimpleHTTPServer 8000
    
else
    echo "❌ Python is not installed. Please install Python 3."
    echo ""
    echo "Alternatively, you can:"
    echo "1. Use Node.js: npx http-server"
    echo "2. Use PHP: php -S localhost:8000"
    echo "3. Upload to GitHub Pages for free hosting"
    exit 1
fi
