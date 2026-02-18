import DB, { GetConfig, Err, Debug } from './db.js';
import Joi from 'joi';

const joiMessages = {
  'string.base': '{{#label}} must be a string',
  'string.empty': '{{#label}} cannot be empty',
  'string.pattern.base': '{{#label}} contains invalid characters',
  'string.min': '{{#label}} must be at least {#limit} characters',
  'string.max': '{{#label}} cannot exceed {#limit} characters',
  'number.base': '{{#label}} must be a number',
  'number.min': '{{#label}} must be at least {#limit}',
  'object.base': '{{#label}} must be an object',
  'any.required': '{{#label}} is required'
};

const schemas = {
  name: Joi.string().pattern(/^[a-zA-Z0-9_@!\-.]+$/).min(3).max(64).required().messages(joiMessages),
  message: Joi.string().min(1).required().messages(joiMessages),
  timestamp: Joi.number().min(0).required().messages(joiMessages)
};

function getPage(room, before) {
  if (!before) before = Date.now() + 1000; // A small margin of error
  const limit = GetConfig('messages_per_page') || 50;
  const query = 'SELECT * FROM messages WHERE room = ? AND timestamp < ? ORDER BY timestamp DESC LIMIT ?';
  return DB.all(query, [room, before, limit]);
}

export const Events = {
  subscribe: {
    schema: Joi.object({
      room: schemas.name.label('Room Code'),
      username: schemas.name.label('Username')
    }).label('Request Object').required(),
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
    schema: schemas.name.label('Room Code'),
    handler: async (io, socket, message) => {
      delete socket.data.username[message];
      socket.leave(message);
      Debug(`User ${socket.id} unsubscribed from room: ${message} with username: ${socket.data.username[message]}`);
    }
  },
  page: {
    schema: Joi.object({
      room: schemas.name.label('Room Code'),
      timestamp: schemas.timestamp.label('Timestamp')
    }).label('Request Object').required(),
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
    schema: Joi.object({
      room: schemas.name.label('Room Code'),
      content: schemas.message.max(parseInt(GetConfig('max_message_length'))).label('Message')
    }).label('Request Object').required(),
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
