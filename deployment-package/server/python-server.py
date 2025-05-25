#!/usr/bin/env python3
"""
Employee Label Printer - Python HTTP Server
Alternative server for systems without Node.js
Requires Python 3.6+
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import socket
from pathlib import Path
import mimetypes
import threading
import time

# Configuration
PORT = int(os.environ.get('PORT', 3000))
HOST = os.environ.get('HOST', '0.0.0.0')

class LabelPrinterHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler for the label printer application"""
    
    def __init__(self, *args, **kwargs):
        # Set the directory to serve files from
        self.app_dir = Path(__file__).parent.parent / 'app'
        super().__init__(*args, directory=str(self.app_dir), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Cache control
        if self.path.endswith('.html'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        else:
            self.send_header('Cache-Control', 'public, max-age=31536000')
        
        super().end_headers()
    
    def do_GET(self):
        # Handle SPA routing - serve index.html for unknown routes
        if not (self.app_dir / self.path.lstrip('/')).exists() and not self.path.startswith('/assets/'):
            self.path = '/index.html'
        
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Custom log format"""
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        print(f"{timestamp} - {format % args}")

def get_local_ip():
    """Get the local IP address for network access"""
    try:
        # Connect to a remote address to determine local IP
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except Exception:
        return 'localhost'

def open_browser_delayed(url, delay=2):
    """Open browser after a short delay"""
    def open_browser():
        time.sleep(delay)
        try:
            webbrowser.open(url)
            print("🌐 Opening browser automatically...")
        except Exception:
            print(f"💡 Please open your browser and navigate to: {url}")
    
    thread = threading.Thread(target=open_browser)
    thread.daemon = True
    thread.start()

def check_requirements():
    """Check if all required files and directories exist"""
    script_dir = Path(__file__).parent.parent
    app_dir = script_dir / 'app'
    
    if not app_dir.exists():
        print(f"❌ ERROR: App directory not found at {app_dir}")
        print("Please ensure the 'app' folder exists in the same directory as this server.")
        return False
    
    index_file = app_dir / 'index.html'
    if not index_file.exists():
        print(f"❌ ERROR: index.html not found at {index_file}")
        print("Please ensure the application files are properly extracted.")
        return False
    
    return True

def start_server():
    """Start the HTTP server"""
    print("🚀 Employee Label Printer Server (Python) Started!")
    print("━" * 50)
    print(f"📍 Server running at: http://{HOST}:{PORT}")
    print(f"📁 Serving files from: {Path(__file__).parent.parent / 'app'}")
    print("━" * 50)
    print("")
    print("🌐 Access the application:")
    print(f"   Local:    http://localhost:{PORT}")
    print(f"   Network:  http://{get_local_ip()}:{PORT}")
    print("")
    print("📝 To stop the server, press Ctrl+C")
    print("")

def main():
    """Main function to start the server"""
    # Check Python version
    if sys.version_info < (3, 6):
        print("❌ ERROR: Python 3.6 or higher is required")
        print(f"Current version: {sys.version}")
        sys.exit(1)
    
    print("")
    print("=" * 40)
    print("  Employee Label Printer")
    print("  Python Server Launcher")
    print("=" * 40)
    print("")
    print(f"✅ Python version: {sys.version.split()[0]}")
    print("")
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    try:
        # Create server
        with socketserver.TCPServer((HOST, PORT), LabelPrinterHTTPRequestHandler) as httpd:
            start_server()
            
            # Open browser automatically
            open_browser_delayed(f"http://localhost:{PORT}")
            
            # Start serving
            httpd.serve_forever()
            
    except OSError as e:
        if e.errno == 98 or e.errno == 48:  # Address already in use
            print(f"❌ ERROR: Port {PORT} is already in use.")
            print("   Please close other applications using this port or try a different port.")
            print(f"   You can set a different port by running: PORT=3001 python3 python-server.py")
        else:
            print(f"❌ Server error: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down server...")
        print("✅ Server stopped successfully.")
        sys.exit(0)

if __name__ == "__main__":
    main()
