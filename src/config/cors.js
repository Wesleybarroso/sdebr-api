export const corsConfig = {
  origin: process.env.FRONT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
};