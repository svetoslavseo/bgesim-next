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
  
  // Don't redirect root
  if (url === '/') {
    return false;
  }
  
  // Don't redirect static files (check for file extension)
  const urlParts = url.split('.');
  if (urlParts.length > 1) {
    const ext = urlParts[urlParts.length - 1].toLowerCase().split('?')[0];
    if (staticExtensions.includes(ext)) {
      return false;
    }
  }
  
  // For Next.js static export with trailingSlash: true,
  // pages are directories with index.html (e.g., /turcia/index.html)
  // So we should redirect any path without trailing slash that doesn't have a file extension
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
  const urlParts = url.split('?');
  const urlPath = urlParts[0];
  const queryString = urlParts.length > 1 ? '?' + urlParts.slice(1).join('?') : '';
  
  // Handle trailing slash redirect
  if (shouldRedirect(urlPath)) {
    const redirectUrl = urlPath + '/' + queryString;
    res.writeHead(301, {
      'Location': redirectUrl,
      'Cache-Control': 'public, max-age=31536000',
    });
    res.end();
    return;
  }
  
  // Normalize the path (remove trailing slash for path construction, but keep for directory detection)
  const normalizedPath = urlPath === '/' ? 'index.html' : urlPath.replace(/\/$/, '');
  
  // Serve the static file
  const filePath = path.join(STATIC_DIR, normalizedPath);
  
  // Try to find the file
  let actualFilePath = filePath;
  if (!fs.existsSync(actualFilePath)) {
    // For Next.js static export with trailingSlash: true,
    // pages are in directories with index.html (e.g., /turcia/index.html)
    // Try with /index.html
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      actualFilePath = indexPath;
    } else if (fs.existsSync(filePath + '.html')) {
      // Fallback: try with .html extension
      actualFilePath = filePath + '.html';
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

