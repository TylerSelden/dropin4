import DB, { GetConfig, Err, Debug } from './db.js';
import { Schemas } from '../../shared/schemas.js';

function getPage(room, before) {
  if (!before) before = Date.now() + 1000; // A small margin of error
  const limit = GetConfig('messages_per_page') || 50;
  const query = 'SELECT * FROM messages WHERE room = ? AND timestamp < ? ORDER BY timestamp DESC LIMIT ?';
  return DB.all(query, [room, before, limit]);
}

export const Events = {
  subscribe: {
    schema: Schemas.subscribe,
    handler: async (io, socket, message) => {
      const { room, username } = message;
      if ([...io.sockets.sockets.values()].some(s => s.rooms.has(room) && s.data.username[room] === username)) throw new Error('Username already taken in this room');
      socket.data.username[room] = username;
      socket.join(room);

      if (!room.startsWith('!')) {
        const messages = await getPage(room);
        socket.emit('page', { room, messages });
      }

      Debug(`User ${socket.id} subscribed to room: ${room} with username: ${username}`);
    }
  },
  unsubscribe: {
    schema: Schemas.name,
    handler: async (io, socket, message) => {
      delete socket.data.username[message];
      socket.leave(message);
      Debug(`User ${socket.id} unsubscribed from room: ${message} with username: ${socket.data.username[message]}`);
    }
  },
  page: {
    Schema: Schemas.page,
    handler: async (io, socket, message) => {
      const { room, timestamp } = message;
      if (!socket.rooms.has(room)) throw new Error('Must be subscribed to room to request messages');
      if (room.startsWith('!')) throw new Error('Cannot request messages for non-persistent rooms');
      const messages = await getPage(room, timestamp);
      socket.emit('page', { room, messages });
      Debug(`User ${socket.id} requested page for room: ${room} before timestamp: ${timestamp}`);

    }
  },
  message: {
    schema: Schemas.message,
    handler: async (io, socket, message) => {
      const { room, content } = message;
      if (!socket.rooms.has(room)) throw new Error('Must be subscribed to room to send messages');
      const timestamp = Date.now();
      const username = socket.data.username[room];

      await DB.run('INSERT INTO messages (room, username, content, timestamp) VALUES (?, ?, ?, ?)', [room, username, content, timestamp]);
      io.to(room).emit('message', { room, username, content, timestamp });
      Debug(`User ${socket.id} sent message to room ${room}: ${content}`);
    }
  }
};

/*
  Events:
    - subscribe: Joins a room with a username, creates if it doesn't exist, and sends previous messages in that room
    - page: Requests a block of messages, sometimes before a given timestamp
    - unsubscribe: Leaves a room
    - message: Sends a message to a given room, saves it to db, and broadcasts it to ALL clients in the room (including sender)
*/

/*
  Client Events:
    - message: Forwarded from a sender
    - page: A block of messages sent to a client, usually after join or scrolling up
    - alert: Sent to a specific client to let them know something important (e.g. new features, maintenance, etc.)
    - err: An error has occurred
*/
