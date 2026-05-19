const net = require('net');
const { exec } = require('child_process');

function findFreePort(startPort = 3000, maxPort = 3100) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', () => {
      if (startPort < maxPort) {
        findFreePort(startPort + 1, maxPort).then(resolve).catch(reject);
      } else {
        reject(new Error('No free ports available'));
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(startPort);
    });
    server.listen(startPort);
  });
}

findFreePort().then((port) => {
  console.log(`Starting server on port ${port}...`);
  const child = exec(`BROWSER=none PORT=${port} react-scripts start`, {
    env: { ...process.env, BROWSER: 'none', PORT: String(port) }
  });
  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);
  child.on('exit', (code) => process.exit(code || 0));
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
