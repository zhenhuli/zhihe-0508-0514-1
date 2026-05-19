const net = require('net');
const { spawn } = require('child_process');

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findFreePort(startPort = 3000, maxPort = 3100) {
  for (let port = startPort; port <= maxPort; port++) {
    const available = await checkPort(port);
    if (available) {
      return port;
    }
  }
  throw new Error('No free ports available between 3000-3100');
}

async function start() {
  try {
    const port = await findFreePort(3050, 3150);
    console.log(`Found free port: ${port}`);
    console.log(`Starting development server on http://localhost:${port}`);
    console.log('Please wait, this may take a few minutes...\n');

    const child = spawn('npx', ['react-scripts', 'start'], {
      env: { ...process.env, BROWSER: 'none', PORT: String(port) }
    });

    child.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    child.on('exit', (code) => {
      console.log(`Server exited with code ${code}`);
      process.exit(code || 0);
    });

    child.on('error', (err) => {
      console.error('Error starting server:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

start();
