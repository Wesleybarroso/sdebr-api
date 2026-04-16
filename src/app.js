import express from 'express';
import routes from './routes/index.js';
import { initDB } from './database/db.js';
import cors from 'cors';
import helmet from 'helmet';

// 🔐 ANTI-SPAM
import { globalLimiter } from './middleware/rateLimit.js';

// 🚫 BLOQUEIO DE IP
import { ipBlocker } from './middleware/ipBlocker.js';

// 🧹 CLEANUP
import { limparIPsExpirados } from './utils/cleanup.js';

// 🔥 NOVO (CONFIG E LOGGER)
import { corsConfig } from './config/cors.js';
import { logger } from './config/logger.js';

const app = express();


// ======================
// 🔐 SEGURANÇA WEB (PRIMEIRO)
// ======================
app.use(helmet());

// 🌐 CORS via config
app.use(cors(corsConfig));


// ======================
// 🔧 MIDDLEWARES BASE
// ======================
app.use(express.json());


// ======================
// 🚫 SEGURANÇA DE REQUISIÇÃO
// ======================
app.use(ipBlocker);
app.use(globalLimiter);


// ======================
// 📜 LOG PROFISSIONAL
// ======================
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip
  });
  next();
});


// ======================
// 🌐 ROTAS
// ======================
app.use('/api', routes);


// ======================
// 🧪 HEALTH CHECK
// ======================
app.get('/', (req, res) => {
  res.send('🚀 SDEBR API ONLINE');
});


// ======================
// ❌ 404
// ======================
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});


// ======================
// 🚨 ERRO GLOBAL (NOVO)
// ======================
app.use((err, req, res, next) => {
  logger.error(err);

  res.status(500).json({
    error: 'Erro interno do servidor'
  });
});


// ======================
// 🗄️ BANCO + LIMPEZA
// ======================
initDB()
  .then(() => {
    logger.info('📦 Banco conectado');

    setInterval(() => {
      limparIPsExpirados();
    }, 5 * 60 * 1000);
  })
  .catch(err => logger.error('Erro no banco:', err));


export default app;