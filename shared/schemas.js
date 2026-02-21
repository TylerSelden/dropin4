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

export const Schemas = {
  name: Joi.string().pattern(/^[a-zA-Z0-9_@!\-.]+$/).min(3).max(64).required().messages(joiMessages),
  message: Joi.string().min(1).required().messages(joiMessages),
  timestamp: Joi.number().min(0).required().messages(joiMessages)
};

Schemas.subscribe = Joi.object({
  room: Schemas.name.label('Room Code'),
  username: Schemas.name.label('Username')
}).required().messages(joiMessages);

Schemas.page = Joi.object({
  room: Schemas.name.label('Room Code'),
  timestamp: Schemas.timestamp.label('Timestamp')
}).required().messages(joiMessages);

Schemas.message = Joi.object({
  room: Schemas.name.label('Room Code'),
  content: Schemas.message.label('Message Content')
}).required().messages(joiMessages);

const options = { errors: { wrap: { label: '' } } };
export function Validate(schema, label, value) {
  const { error } = schema.label(label).validate(value, options);
  return error ? error.message : null;
}

export function Assert(schema, label, value) {
  Joi.assert(value, schema.label(label).required(), options);
}
