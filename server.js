#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8000;
const HOST = 'localhost';

const server = http.createServer((req, res) => {
    // Default to index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Set content types
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4'
    };
    
    // Read and serve file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
        } else {
            res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
            res.end(data);
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log('\n🎉 Random Joke Generator');
    console.log('========================\n');
    console.log(`✅ Server running at http://${HOST}:${PORT}`);
    console.log('\n📂 Serving files from:', __dirname);
    console.log('\n⌨️  Press Ctrl+C to stop the server\n');
    
    // Auto-open browser
    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    require('child_process').exec(start + ' http://' + HOST + ':' + PORT);
});

// Handle errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        process.exit(1);
    }
});
