export default {
  type: 'object',
  properties: {
    email: { type: 'string' },
    method: { type: 'string' },
  },
  additionalProperties: false,
  required: ['email'],
}
