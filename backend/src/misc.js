import DB, { GetConfig, Err, Debug } from './db.js';
import Joi from 'joi';

const joiMessages = {
  'string.base': '{{#label}} must be a string',
  'string.empty': '{{#label}} cannot be empty',
  'string.pattern.base': '{{#label}} contains invalid characters',
  'string.min': '{{#label}} must be at least {#limit} characters',
  'string.max': '{{#label}} cannot exceed {#limit} characters',
  'any.required': '{{#label}} is required'
};

const schemas = {
  name: Joi.string().pattern(/^[a-zA-Z0-9_@!\-.]+$/).min(3).max(64).required().messages(joiMessages),
  message: Joi.string().min(1).max(parseInt(GetConfig('max_message_length'))).required().messages(joiMessages)
};

export const Events = {
  set_username: {
    schema: schemas.name.label('Username'),
    handler: async (io, socket, message) => {
      if (socket.data.username) throw new Error('Username already set');
      socket.data.username = message;
      Debug(`User ${socket.id} set username to: ${message}`);
    }
  },
  subscribe: {
    schema: schemas.name.label('Room Code'),
    handler: async (io, socket, message) => {
      if (!socket.data.username) throw new Error('Username must be set');
      socket.join(message);

      console.log(await DB.all('SELECT * FROM messages WHERE room = ? ORDER BY timestamp ASC LIMIT 50', [message]));

      Debug(`User ${socket.id} subscribed to room: ${message}`);
    }
  },
  unsubscribe: {
    schema: schemas.name.label('Room Code'),
    handler: async (io, socket, message) => {
      socket.leave(message);
      Debug(`User ${socket.id} unsubscribed from room: ${message}`);
    }
  },
  message: {
    schema: Joi.object({
      room: schemas.name.label('Room Code'),
      content: schemas.message.label('Message')
    }).label('Request Object').required(),
    handler: async (io, socket, message) => {
      if (!socket.data.username) throw new Error('Username must be set');
      if (!socket.rooms.has(message.room)) throw new Error('Must be subscribed to room to send messages');
      const { room, content } = message;
      const timestamp = Date.now();

      await DB.run('INSERT INTO messages (room, username, content, timestamp) VALUES (?, ?, ?, ?)', [room, socket.data.username, content, timestamp]);
      io.to(room).emit('message', { room, username: socket.data.username, content, timestamp });
      Debug(`User ${socket.id} sent message to room ${room}: ${content}`);
    }
  }
};

/*
  Events:
    // set self username
    - set_username: If the client doesn't already have a username, they can set one. This is required before subscribing to a room and sending messages.
    - subscribe: Joins a room, creates if it doesn't exist, and sends previous messages in that room
    - unsubscribe: Leaves a room
    - message: Sends a message to a given room, saves it to db, and broadcasts it to ALL clients in the room (including sender)
*/

/*
  Client Events:
    - message: Forwarded from a sender
    - alert: Sent to a specific client to let them know something important (e.g. new features, maintenance, etc.)
    - err: An error has occurred
*/
