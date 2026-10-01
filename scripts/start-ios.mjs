import { spawn } from 'node:child_process';
import net from 'node:net';

const host = '127.0.0.1';

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(false);
        return;
      }

      reject(error);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, host);
  });
}

async function findAvailablePort() {
  for (let port = 8081; port <= 8090; port += 1) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error('No available Metro port found between 8081 and 8090.');
}

async function waitForMetro(port) {
  const statusUrl = `http://${host}:${port}/status`;

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(statusUrl);
      if ((await response.text()) === 'packager-status:running') {
        return;
      }
    } catch (error) {
      if (attempt === 59) {
        throw error;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Metro did not become ready at ${statusUrl}.`);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? 'unknown'}.`));
    });
  });
}

const port = await findAvailablePort();
const expo = spawn(
  process.platform === 'win32' ? 'yarn.cmd' : 'yarn',
  ['expo', 'start', '--lan', '--port', String(port)],
  { stdio: 'inherit' },
);

function stopExpo(signal) {
  if (!expo.killed) {
    expo.kill(signal);
  }
}

process.once('SIGINT', () => stopExpo('SIGINT'));
process.once('SIGTERM', () => stopExpo('SIGTERM'));

try {
  await waitForMetro(port);
  await run('open', [
    '/Applications/Xcode.app/Contents/Applications/DeviceHub.app',
  ]);
  await run('xcrun', ['simctl', 'openurl', 'booted', `exp://${host}:${port}`]);
} catch (error) {
  stopExpo('SIGTERM');
  throw error;
}

expo.once('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exitCode = code ?? 1;
});
