export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'sdebr_secret',
  expiresIn: '1d'
};