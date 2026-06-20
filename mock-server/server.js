const http = require('http');
const url = require('url');

const users = [
  {
    id: 1,
    email: 'admin@stage.com',
    username: 'admin',
    password: '1234',
    firstName: 'Admin',
    lastName: 'User',
    phone: '0601234567',
    active: true,
    roleId: 1,
    role: 'Admin',
    token: 'mock-access-token-admin',
    refreshToken: 'mock-refresh-token-admin',
    tokenExpirationDate: new Date(Date.now() + 3600000).toISOString()
  },
  {
    id: 2,
    email: 'user@stage.com',
    username: 'user',
    password: 'User123!',
    firstName: 'Regular',
    lastName: 'user',
    phone: '0607654321',
    active: true,
    roleId: 2,
    role: 'User',
    token: 'mock-access-token-user',
    refreshToken: 'mock-refresh-token-user',
    tokenExpirationDate: new Date(Date.now() + 3600000).toISOString()
  }
];

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // POST /api/LOGIN/LOGIN
  if (req.method === 'POST' && req.url === '/api/LOGIN/LOGIN') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        const incomingUser = parsed.userName || parsed.username || null;
        const incomingPass = parsed.password || null;
        const found = users.find(u =>
          (incomingUser && u.username === incomingUser) ||
          (parsed.email && u.email === parsed.email)
        );
        if (!found || found.password !== incomingPass) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid credentials' }));
          return;
        }
        if (!found.active) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Account is disabled' }));
          return;
        }
        found.tokenExpirationDate = new Date(Date.now() + 3600000).toISOString();
        const publicUser = {
          id: found.id,
          email: found.email,
          userName: found.username,
          firstName: found.firstName,
          lastName: found.lastName,
          phone: found.phone,
          active: found.active,
          roleId: found.roleId,
          roleName: found.role,
          token: found.token,
          refreshToken: found.refreshToken,
          tokenExpirationDate: found.tokenExpirationDate,
          expiresIn: 3600
        };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(publicUser));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid JSON body' }));
      }
    });
    return;
  }

  // GET /api/users
  if (req.method === 'GET' && req.url === '/api/users') {
    const result = users.map(({ password, ...u }) => u);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  // GET /api/users/:id
  const userMatch = req.url.match(/^\/api\/users\/(\d+)$/);
  if (req.method === 'GET' && userMatch) {
    const user = users.find(u => u.id === Number(userMatch[1]));
    if (user) {
      const { password, ...publicUser } = user;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(publicUser));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'No route for ' + req.method + ' ' + req.url }));
});

server.listen(3000, () => {
  console.log('\n  Mock server running → http://localhost:3000/api\n');
  console.log('  Endpoints:');
  console.log('    POST /api/LOGIN/LOGIN   { username, password } or { email, password }');
  console.log('    GET  /api/users');
  console.log('    GET  /api/users/:id\n');
});
