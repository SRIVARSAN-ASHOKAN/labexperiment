// server.js - Working Node.js HTTP Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'users.json');

// Initialize data file
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [], messages: [] }, null, 2));
  console.log('✅ Created users.json file');
}

// Helper to read data
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { users: [], messages: [] };
  }
}

// Helper to write data
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Create server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`📝 ${method} ${pathname}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET / - Home page
  if (pathname === '/' && method === 'GET') {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>User Details API</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .card h2 {
            color: #667eea;
            margin-bottom: 15px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }
        button:hover {
            transform: translateY(-2px);
        }
        .data-item {
            background: #f8f9fa;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            border-left: 3px solid #667eea;
        }
        .timestamp {
            font-size: 11px;
            color: #999;
            margin-top: 5px;
        }
        .status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            display: none;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
            display: block;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            display: block;
        }
        .api-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .api-info p {
            margin: 5px 0;
        }
        code {
            background: #e9ecef;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 User Details API Server</h1>
        
        <div class="grid">
            <div class="card">
                <h2>📝 Add New User</h2>
                <form id="userForm">
                    <div class="form-group">
                        <label>Name:</label>
                        <input type="text" id="userName" required>
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input type="email" id="userEmail" required>
                    </div>
                    <div class="form-group">
                        <label>Age:</label>
                        <input type="number" id="userAge">
                    </div>
                    <button type="submit">Add User</button>
                </form>
                <div id="userStatus" class="status"></div>
            </div>

            <div class="card">
                <h2>💬 Send Message</h2>
                <form id="messageForm">
                    <div class="form-group">
                        <label>User ID:</label>
                        <input type="number" id="messageUserId" required>
                    </div>
                    <div class="form-group">
                        <label>Message:</label>
                        <textarea id="messageText" rows="3" required></textarea>
                    </div>
                    <button type="submit">Send Message</button>
                </form>
                <div id="messageStatus" class="status"></div>
            </div>
        </div>

        <div class="card">
            <h2>📊 All Users</h2>
            <div id="usersList">Loading...</div>
        </div>

        <div class="card">
            <h2>💬 All Messages</h2>
            <div id="messagesList">Loading...</div>
        </div>

        <div class="card">
            <h2>📚 API Endpoints</h2>
            <div class="api-info">
                <p><code>GET /users</code> - Get all users</p>
                <p><code>GET /users/:id</code> - Get user by ID</p>
                <p><code>POST /users</code> - Create new user</p>
                <p><code>GET /messages</code> - Get all messages</p>
                <p><code>POST /messages</code> - Send message</p>
            </div>
        </div>
    </div>

    <script>
        loadUsers();
        loadMessages();

        document.getElementById('userForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                age: parseInt(document.getElementById('userAge').value) || null
            };
            
            try {
                const res = await fetch('/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                });
                const data = await res.json();
                if (res.ok) {
                    showStatus('userStatus', 'User added!', 'success');
                    document.getElementById('userForm').reset();
                    loadUsers();
                } else {
                    showStatus('userStatus', data.error, 'error');
                }
            } catch (err) {
                showStatus('userStatus', 'Error', 'error');
            }
        });

        document.getElementById('messageForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = {
                userId: parseInt(document.getElementById('messageUserId').value),
                message: document.getElementById('messageText').value
            };
            
            try {
                const res = await fetch('/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(message)
                });
                const data = await res.json();
                if (res.ok) {
                    showStatus('messageStatus', 'Message sent!', 'success');
                    document.getElementById('messageForm').reset();
                    loadMessages();
                } else {
                    showStatus('messageStatus', data.error, 'error');
                }
            } catch (err) {
                showStatus('messageStatus', 'Error', 'error');
            }
        });

        async function loadUsers() {
            try {
                const res = await fetch('/users');
                const users = await res.json();
                const container = document.getElementById('usersList');
                if (users.length === 0) {
                    container.innerHTML = '<p>No users yet. Add your first user!</p>';
                } else {
                    container.innerHTML = users.map(user => \`
                        <div class="data-item">
                            <strong>ID: \${user.id}</strong><br>
                            Name: \${user.name}<br>
                            Email: \${user.email}<br>
                            \${user.age ? 'Age: ' + user.age + '<br>' : ''}
                            <div class="timestamp">\${new Date(user.timestamp).toLocaleString()}</div>
                        </div>
                    \`).join('');
                }
            } catch (err) {
                document.getElementById('usersList').innerHTML = '<p>Error loading users</p>';
            }
        }

        async function loadMessages() {
            try {
                const res = await fetch('/messages');
                const messages = await res.json();
                const container = document.getElementById('messagesList');
                if (messages.length === 0) {
                    container.innerHTML = '<p>No messages yet.</p>';
                } else {
                    container.innerHTML = messages.map(msg => \`
                        <div class="data-item">
                            <strong>User ID: \${msg.userId}</strong><br>
                            Message: \${msg.message}<br>
                            <div class="timestamp">\${new Date(msg.timestamp).toLocaleString()}</div>
                        </div>
                    \`).join('');
                }
            } catch (err) {
                document.getElementById('messagesList').innerHTML = '<p>Error loading messages</p>';
            }
        }

        function showStatus(elementId, message, type) {
            const el = document.getElementById(elementId);
            el.textContent = message;
            el.className = \`status \${type}\`;
            setTimeout(() => {
                el.className = 'status';
            }, 3000);
        }

        setInterval(() => {
            loadUsers();
            loadMessages();
        }, 5000);
    </script>
</body>
</html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // GET /users
  if (pathname === '/users' && method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.users));
    return;
  }

  // GET /users/:id
  if (pathname.match(/^\/users\/\d+$/) && method === 'GET') {
    const id = parseInt(pathname.split('/')[2]);
    const data = readData();
    const user = data.users.find(u => u.id === id);
    
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
    }
    return;
  }

  // GET /messages
  if (pathname === '/messages' && method === 'GET') {
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.messages));
    return;
  }

  // POST /users
  if (pathname === '/users' && method === 'POST') {
    try {
      const body = await parseBody(req);
      
      if (!body.name || !body.email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Name and email required' }));
        return;
      }
      
      const data = readData();
      const newUser = {
        id: Date.now(),
        name: body.name,
        email: body.email,
        age: body.age || null,
        timestamp: new Date().toISOString()
      };
      
      data.users.push(newUser);
      writeData(data);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User created', user: newUser }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
    return;
  }

  // POST /messages
  if (pathname === '/messages' && method === 'POST') {
    try {
      const body = await parseBody(req);
      
      if (!body.userId || !body.message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User ID and message required' }));
        return;
      }
      
      const data = readData();
      const newMessage = {
        id: Date.now(),
        userId: body.userId,
        message: body.message,
        timestamp: new Date().toISOString()
      };
      
      data.messages.push(newMessage);
      writeData(data);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Message sent', message: newMessage }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║     🚀 Node.js HTTP Server Started Successfully      ║
╠══════════════════════════════════════════════════════╣
║  Server running at: http://localhost:${PORT}          ║
║  Open in browser: http://localhost:${PORT}            ║
╠══════════════════════════════════════════════════════╣
║  Available Endpoints:                                ║
║  • GET  /users        - Get all users               ║
║  • GET  /users/:id    - Get user by ID              ║
║  • POST /users        - Create new user             ║
║  • GET  /messages     - Get all messages            ║
║  • POST /messages     - Send message                ║
╚══════════════════════════════════════════════════════╝
  `);
});