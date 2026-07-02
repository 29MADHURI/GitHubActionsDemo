const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 8080;

const server = http.createServer((req, res) => {
    // 1. Determine the target file path
    // If the user requests the root "/", serve index.html. Otherwise, clean up the requested URL path.
    let filePath = req.url === '/' 
        ? path.join(__dirname, 'application', 'index.html') 
        : path.join(__dirname, 'application', req.url);

    // 2. Extract the file extension (e.g., ".css", ".js")
    const extname = String(path.extname(filePath)).toLowerCase();
    
    // 3. Define supported MIME types so the browser interprets files correctly
    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    // Default to plain binary stream if the file type is unknown
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // 4. Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found (404)
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // Server error (500)
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success (200) - deliver file with matching content-type header
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://${hostname}:${port}`);
});