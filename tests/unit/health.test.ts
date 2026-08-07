import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import app from '../../src/app.js';

test('GET /health returns ok payload', async () => {
  const server = createServer(app);
  const address = await new Promise<{ port: number }>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr !== 'string') {
        resolve({ port: addr.port });
      }
    });
  });

  const response = await fetch(`http://127.0.0.1:${address.port}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  server.close();
});
