import { Server } from 'socket.io';
import DB, { Debug, Info, Err, Cleanup } from './src/db.js';
import { Events } from './src/events.js';
import { Assert } from '../shared/schemas.js';

const io = new Server(process.env.PORT || 8080, {
  cors: {
    origin: '*',
  },
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  Debug(`New user connected: ${socket.id}`);
  socket.data.username = {};

  for (const [event, { schema, handler }] of Object.entries(Events)) {
    socket.on(event, async (message, ack) => {
      try {
        Debug(`${event} event fired by ${socket.id}`);

        const label = schema.describe().flags?.label || 'Request Object';
        Assert(schema, label, message);
        await handler(io, socket, message);
        if (ack) ack();
      } catch (err) {
        const details = err.details?.[0].message || err.message || 'Generic error';
        Err(`Error handling event ${event} from ${socket.id}: ${details}`);
        socket.emit('err', details);
      }
    });
  }

  socket.on('disconnect', () => {
    Debug(`User disconnected: ${socket.id}`);
  });
});

setInterval(() => {
  Cleanup();
}, (process.env.DB_CLEANUP_INTERVAL || 24) * 1000 * 60 * 60);

Info(`WebSocket server initialized on port ${process.env.PORT || 8080}`);
