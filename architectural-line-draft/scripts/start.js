const net = require('net');
const { spawn } = require('child_process');
const path = require('path');

function findFreePort(startPort, maxAttempts = 50) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    let port = startPort;
    
    function tryPort() {
      const server = net.createServer();
      server.once('error', () => {
        attempts++;
        if (attempts >= maxAttempts) {
          reject(new Error(`Could not find a free port after ${maxAttempts} attempts`));
        } else {
          port++;
          tryPort();
        }
      });
      server.once('listening', () => {
        server.close();
        resolve(port);
      });
      server.listen(port, '127.0.0.1');
    }
    tryPort();
  });
}

async function start() {
  const port = await findFreePort(9000);
  console.log(`Starting server on port ${port}...`);
  console.log(`Open http://localhost:${port} in your browser`);
  
  const env = Object.create(process.env);
  env.PORT = port;
  
  const snowpack = spawn('npx', ['snowpack', 'dev', '--port', port.toString()], {
    env,
    cwd: path.resolve(__dirname, '..'),
    stdio: ['pipe', 'inherit', 'inherit']
  });
  
  snowpack.stdin.write('Y\n');
  snowpack.stdin.end();
  
  snowpack.on('close', (code) => {
    process.exit(code);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
