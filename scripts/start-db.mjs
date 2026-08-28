import { PGlite } from '@electric-sql/pglite';
import * as net from 'net';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(process.cwd(), '.pglite_data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

process.on('uncaughtException', (err) => {
  if (err && (err.code === 'ECONNRESET' || err.message?.includes('ECONNRESET'))) {
    return;
  }
  console.warn('[PGlite Server Warning]', err?.message || err);
});

process.on('unhandledRejection', (reason) => {
  console.warn('[PGlite Unhandled Rejection]', reason);
});

const db = new PGlite(dataDir);
const PORT = 5432;

function buildParameterStatus(key, val) {
  const kBuf = Buffer.from(key + '\0', 'utf8');
  const vBuf = Buffer.from(val + '\0', 'utf8');
  const len = 4 + kBuf.length + vBuf.length;
  const buf = Buffer.alloc(1 + len);
  buf.write('S', 0);
  buf.writeUInt32BE(len, 1);
  kBuf.copy(buf, 5);
  vBuf.copy(buf, 5 + kBuf.length);
  return buf;
}

function buildStartupResponse() {
  const authOk = Buffer.alloc(9);
  authOk.write('R', 0);
  authOk.writeUInt32BE(8, 1);
  authOk.writeUInt32BE(0, 5);

  const params = Buffer.concat([
    buildParameterStatus('server_version', '16.0'),
    buildParameterStatus('client_encoding', 'UTF8'),
    buildParameterStatus('standard_conforming_strings', 'on'),
    buildParameterStatus('TimeZone', 'UTC'),
    buildParameterStatus('integer_datetimes', 'on'),
    buildParameterStatus('session_authorization', 'postgres')
  ]);

  const backendKey = Buffer.alloc(13);
  backendKey.write('K', 0);
  backendKey.writeUInt32BE(12, 1);
  backendKey.writeUInt32BE(1, 5);
  backendKey.writeUInt32BE(2, 9);

  const ready = Buffer.alloc(6);
  ready.write('Z', 0);
  ready.writeUInt32BE(5, 1);
  ready.write('I', 5);

  return Buffer.concat([authOk, params, backendKey, ready]);
}

const GSS_NO = Buffer.from('N');
const SSL_NO = Buffer.from('N');
const STARTUP_RES = buildStartupResponse();

function isSSLRequest(buf) {
  return buf.length >= 8 && buf.readInt32BE(4) === 80877103;
}
function isGSSRequest(buf) {
  return buf.length >= 8 && buf.readInt32BE(4) === 80877104;
}
function isStartup(buf) {
  return buf.length >= 8 && buf.readInt32BE(4) === 196608;
}

const server = net.createServer((socket) => {
  let clientBuffer = Buffer.alloc(0);
  let isProcessing = false;
  const queue = [];

  socket.on('error', () => {});

  async function processQueue() {
    if (isProcessing) return;
    isProcessing = true;

    while (queue.length > 0) {
      const chunk = queue.shift();
      clientBuffer = Buffer.concat([clientBuffer, chunk]);

      while (clientBuffer.length > 0) {
        if (clientBuffer.length < 4) break;
        const firstByte = clientBuffer[0];

        if (clientBuffer.length >= 8 && isSSLRequest(clientBuffer)) {
          socket.write(SSL_NO);
          clientBuffer = clientBuffer.subarray(8);
          continue;
        }
        if (clientBuffer.length >= 8 && isGSSRequest(clientBuffer)) {
          socket.write(GSS_NO);
          clientBuffer = clientBuffer.subarray(8);
          continue;
        }
        if (clientBuffer.length >= 8 && isStartup(clientBuffer)) {
          const msgLen = clientBuffer.readUInt32BE(0);
          if (clientBuffer.length < msgLen) break;
          socket.write(STARTUP_RES);
          clientBuffer = clientBuffer.subarray(msgLen);
          continue;
        }

        if (clientBuffer.length < 5) break;
        const msgLen = clientBuffer.readUInt32BE(1) + 1;
        if (clientBuffer.length < msgLen) break;

        const msg = clientBuffer.subarray(0, msgLen);
        clientBuffer = clientBuffer.subarray(msgLen);

        const msgType = String.fromCharCode(firstByte);
        if (msgType === 'X') {
          socket.end();
          break;
        }

        try {
          const res = await db.execProtocol(msg);
          if (res && res.data) {
            socket.write(Buffer.from(res.data));
          }
        } catch (err) {
          const errMsg = Buffer.from(err?.message || 'DB Error', 'utf8');
          const errBuf = Buffer.alloc(1 + 4 + 1 + errMsg.length + 2);
          errBuf.write('E', 0);
          errBuf.writeUInt32BE(errBuf.length - 1, 1);
          errBuf.write('M', 5);
          errMsg.copy(errBuf, 6);
          errBuf.writeUInt8(0, 6 + errMsg.length);
          errBuf.writeUInt8(0, 7 + errMsg.length);

          const ready = Buffer.alloc(6);
          ready.write('Z', 0);
          ready.writeUInt32BE(5, 1);
          ready.write('I', 5);

          socket.write(Buffer.concat([errBuf, ready]));
        }
      }
    }

    isProcessing = false;
  }

  socket.on('data', (data) => {
    queue.push(data);
    processQueue();
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[PGlite Server] Real PostgreSQL server running on 0.0.0.0:${PORT}`);
  console.log(`[PGlite Server] Data directory: ${dataDir}`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down PGlite server...');
  try {
    server.close();
    await db.close();
  } catch (e) {}
  process.exit(0);
});
