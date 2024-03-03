const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set response headers
  res.setHeader('Content-Type', 'text/html');

  let reqUrl = req.url
  if (reqUrl === '/'){
    reqUrl = '/index.html'
  }


  // Routing
  if (reqUrl === '/index.html') {
    // Serve index.html
    serveFile(res, `client/${reqUrl}`, 'text/html');
  } else if (reqUrl === '/service-worker.js') {
    // Serve worker.js
    serveFile(res, `client/${reqUrl}`, 'application/javascript');
  } else if (reqUrl === '/manifest.json') {
    // Serve worker.js
    serveFile(res, `client/${reqUrl}`, 'application/json');
  } else if (reqUrl === '/api/data' && req.method === 'GET') {
    // Sample JSON data
    const randomNumber = Math.floor(Math.random() * 3); // Generate a random number between 0 and 2

    const resp = []
    for(let i = 0; i < randomNumber; i++){
      const id = Date.now() + '_' + i;
      const created_date = new Date().toISOString();
      resp.push({
        id: Date.now() + '_' + i,
        msg: `New Message - ${id}`,
        created_date,
      })
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(resp));
  } else {
    // Handle invalid routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Function to serve files
function serveFile(res, filename, contentType) {
  const filePath = path.join(__dirname, filename);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error: ' + err);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
