#!/usr/bin/env node

/**
 * Employee Label Printer - Production Server
 * A lightweight HTTP server for serving the label printer application
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const APP_DIR = path.join(__dirname, '..', 'app');

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

/**
 * Get MIME type for a file based on its extension
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Serve static files from the app directory
 */
function serveStaticFile(req, res, filePath) {
  const fullPath = path.join(APP_DIR, filePath);
  
  // Security check: ensure the file is within the app directory
  if (!fullPath.startsWith(APP_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, serve index.html for SPA routing
        serveStaticFile(req, res, 'index.html');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
      return;
    }

    const mimeType = getMimeType(fullPath);
    const headers = {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    };

    // Don't cache HTML files for development
    if (mimeType === 'text/html') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    res.writeHead(200, headers);
    res.end(data);
  });
}

/**
 * Main request handler
 */
function requestHandler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = url.pathname;

    // Remove leading slash and decode URI
    pathname = decodeURIComponent(pathname.substring(1));

    // Default to index.html for root requests
    if (pathname === '' || pathname === '/') {
      pathname = 'index.html';
    }

    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

    // Serve the requested file
    serveStaticFile(req, res, pathname);

  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

/**
 * Start the server
 */
function startServer() {
  // Check if app directory exists
  if (!fs.existsSync(APP_DIR)) {
    console.error(`Error: App directory not found at ${APP_DIR}`);
    console.error('Please ensure the "app" folder exists in the same directory as this server.');
    process.exit(1);
  }

  // Create and start the server
  const server = http.createServer(requestHandler);

  server.listen(PORT, HOST, () => {
    console.log('🚀 Employee Label Printer Server Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📍 Server running at: http://${HOST}:${PORT}`);
    console.log(`📁 Serving files from: ${APP_DIR}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🌐 Access the application:');
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Network:  http://${getLocalIP()}:${PORT}`);
    console.log('');
    console.log('📝 To stop the server, press Ctrl+C');
    console.log('');

    // Try to open the browser automatically
    openBrowser(`http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Error: Port ${PORT} is already in use.`);
      console.error('   Please close other applications using this port or try a different port.');
      console.error(`   You can set a different port by running: PORT=3001 node server.js`);
    } else {
      console.error('❌ Server error:', err.message);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
      console.log('✅ Server stopped successfully.');
      process.exit(0);
    });
  });
}

/**
 * Get local IP address for network access
 */
function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  
  return 'localhost';
}

/**
 * Try to open the browser automatically
 */
function openBrowser(url) {
  const { exec } = require('child_process');
  const platform = process.platform;
  
  let command;
  
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.log(`💡 Please open your browser and navigate to: ${url}`);
    } else {
      console.log('🌐 Opening browser automatically...');
    }
  });
}

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { startServer, requestHandler };
