import { WebSocketServer} from 'ws';
import DB, { GetConfig, Info } from './src/db.js';

const ws = new WebSocketServer({ port: GetConfig('port') });

ws.on('connection', (socket) => {
  socket.on('message', (message) => {
    console.log(`Received message: ${message.toString()}`);
  });
});

Info(`WebSocket server initialized on port ${GetConfig('port')}`);
