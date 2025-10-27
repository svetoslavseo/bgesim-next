const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a custom server that handles trailing slash redirects
const PORT = process.env.PORT || 3000;
const STATIC_DIR = path.join(__dirname, 'out');

// File extensions that should not redirect to trailing slash
const staticExtensions = ['css', 'js', 'json', 'xml', 'txt', 'ico', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'woff', 'woff2', 'ttf', 'eot', 'html'];

// Check if URL should redirect to trailing slash
function shouldRedirect(url) {
  // Don't redirect if it already has a trailing slash
  if (url.endsWith('/')) {
    return false;
  }
  
  // Don't redirect static files
  const ext = url.split('.').pop().toLowerCase();
  if (staticExtensions.includes(ext)) {
    return false;
  }
  
  // Don't redirect if it's a file that exists
  const filePath = path.join(STATIC_DIR, url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return false;
  }
  
  return true;
}

// Get content type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
  };
  
  return contentTypes[ext] || 'application/octet-stream';
}

// Create server
const server = http.createServer((req, res) => {
  let url = req.url;
  
  // Remove query string for path matching
  const urlPath = url.split('?')[0];
  
  // Handle trailing slash redirect
  if (shouldRedirect(urlPath)) {
    res.writeHead(301, {
      'Location': urlPath + '/',
      'Cache-Control': 'public, max-age=31536000',
    });
    res.end();
    return;
  }
  
  // Serve the static file
  const filePath = urlPath === '/' ? path.join(STATIC_DIR, 'index.html') : path.join(STATIC_DIR, urlPath);
  
  // Try to find the file
  let actualFilePath = filePath;
  if (!fs.existsSync(actualFilePath)) {
    // Try with .html extension
    if (fs.existsSync(filePath + '.html')) {
      actualFilePath = filePath + '.html';
    } else if (fs.existsSync(filePath + '/index.html')) {
      actualFilePath = filePath + '/index.html';
    } else if (!urlPath.endsWith('/') && fs.existsSync(filePath + '.html')) {
      // Redirect to with trailing slash
      res.writeHead(301, {
        'Location': urlPath + '/',
        'Cache-Control': 'public, max-age=31536000',
      });
      res.end();
      return;
    } else {
      // File not found, serve 404
      actualFilePath = path.join(STATIC_DIR, '404.html');
      if (!fs.existsSync(actualFilePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }
  }
  
  // Check if it's a directory
  const stat = fs.statSync(actualFilePath);
  if (stat.isDirectory()) {
    actualFilePath = path.join(actualFilePath, 'index.html');
    if (!fs.existsSync(actualFilePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
  }
  
  // Set security headers
  const headers = {
    'Content-Type': getContentType(actualFilePath),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  
  // Set caching headers for static files
  if (actualFilePath.endsWith('.html')) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  } else {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  }
  
  // Serve the file
  const fileStream = fs.createReadStream(actualFilePath);
  res.writeHead(200, headers);
  fileStream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

