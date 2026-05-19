import { exec } from 'child_process'
import detectPort from 'detect-port'

const defaultPort = 8080

async function start() {
  const port = await detectPort(defaultPort)
  
  if (port !== defaultPort) {
    console.log(`端口 ${defaultPort} 已被占用，使用空闲端口 ${port}`)
  } else {
    console.log(`使用默认端口 ${port}`)
  }
  
  process.env.PORT = port
  
  const command = `npx vite --port ${port}`
  
  console.log(`启动开发服务器: http://localhost:${port}`)
  
  const child = exec(command, {
    env: { ...process.env, PORT: port },
    cwd: process.cwd()
  })
  
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  
  child.on('exit', (code) => {
    process.exit(code)
  })
}

start().catch(console.error)
