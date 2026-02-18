import { Server } from 'socket.io';
import DB, { GetConfig, Debug, Info, Err } from './src/db.js';
import { Events } from './src/misc.js';
import Joi from 'joi';

const io = new Server(GetConfig('port'), {
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

        Joi.assert(message, schema);
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

Info(`WebSocket server initialized on port ${GetConfig('port')}`);

// TODO: Rate limits
