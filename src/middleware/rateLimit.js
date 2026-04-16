import rateLimit from 'express-rate-limit';
import { blockIP } from './ipBlocker.js';


// 🌍 GLOBAL (COM BLOQUEIO)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,

  handler: async (req, res) => {
    await blockIP(req.ip); // 🚫 bloqueia no banco

    return res.status(429).json({
      error: 'Muitas requisições. Seu IP foi bloqueado temporariamente.'
    });
  }
});


// 🤝 DOAÇÕES (ANTI-SPAM FORTE)
export const doacaoLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,

  handler: async (req, res) => {
    await blockIP(req.ip); // 🚫 bloqueia se abusar

    return res.status(429).json({
      error: 'Muitas doações em pouco tempo. IP bloqueado.'
    });
  }
});