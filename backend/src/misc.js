import { Err, Debug } from './db.js';
import Joi from 'joi';

const schemas = {
  room: Joi.string().pattern(/^[a-zA-Z0-9_#@!\-.]+$/).min(3).max(64).required().messages({
    'string.base': 'Room name must be a string',
    'string.empty': 'Room name cannot be empty',
    'string.pattern.base': 'Room name contains invalid characters',
    'string.min': 'Room name must be at least 3 characters',
    'string.max': 'Room name cannot exceed 64 characters',
    'any.required': 'Room name is required'
  })
};

export const Events = {
  subscribe: {
    schema: schemas.room,
    handler: (socket, message) => {
      Debug(`User ${socket.id} subscribed to room: ${message}`);
    }
  }
};

/*
  Events:
    - subscribe: Joins a room, creates if it doesn't exist, and sends previous messages in that room
    - unsubscribe: Leaves a room
    - message: Sends a message to a given room, saves it to db, and broadcasts it to ALL clients in the room (including sender)
*/
