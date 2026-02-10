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

  for (const [event, { schema, handler }] of Object.entries(Events)) {
    socket.on(event, (message) => {
      try {
        Debug(`${event} event fired by ${socket.id}`);
        Joi.assert(message, schema);
        handler(socket, message);
      } catch (err) {
        Err(`Error handling event ${event} from ${socket.id}: ${err.message}`);
        socket.emit('err', err.message);
      }
    });
  }

  socket.on('disconnect', () => {
    Debug(`User disconnected: ${socket.id}`);
  });
});

Info(`WebSocket server initialized on port ${GetConfig('port')}`);
