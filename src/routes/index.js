import { Router } from 'express';

// ======================
// 📍 Controllers
// ======================
import {
  criarPonto,
  listarPontos,
  atualizarPonto,
  deletarPonto
} from '../controllers/pontosController.js';

import {
  criarNecessidade,
  listarNecessidades,
  atualizarNecessidade,
  deletarNecessidade
} from '../controllers/necessidadesController.js';

import {
  registrarDoacao,
  listarDoacoes,
  deletarDoacao
} from '../controllers/doacoesController.js';

import {
  listarIPsBloqueados,
  desbloquearIP,
  listarSolicitacoes,
  aprovarPonto,
  rejeitarPonto
} from '../controllers/adminController.js';

import {
  register,
  login
} from '../controllers/authController.js';

// ======================
// 🔒 Middlewares
// ======================
import { authMiddleware } from '../middleware/auth.js';
import { permit } from '../middleware/role.js';

// 🚫 Rate limit
import { doacaoLimiter } from '../middleware/rateLimit.js';

const router = Router();


// ======================
// 🌐 ROOT
// ======================
router.get('/', (req, res) => {
  res.json({ message: 'SDEBR API funcionando 🚀' });
});


// ======================
// 👤 AUTH
// ======================
router.post('/register', register);
router.post('/login', login);


// ======================
// 📍 PONTOS
// ======================

// público
router.get('/pontos', listarPontos);

// admin
router.post('/pontos', authMiddleware, permit('admin'), criarPonto);
router.put('/pontos/:id', authMiddleware, permit('admin'), atualizarPonto);
router.delete('/pontos/:id', authMiddleware, permit('admin'), deletarPonto);


// ======================
// 📦 NECESSIDADES
// ======================

// público
router.get('/necessidades', listarNecessidades);

// ponto dono + admin
router.post('/necessidades', authMiddleware, permit('ponto', 'admin'), criarNecessidade);
router.patch('/necessidades/:id', authMiddleware, permit('ponto', 'admin'), atualizarNecessidade);
router.delete('/necessidades/:id', authMiddleware, permit('ponto', 'admin'), deletarNecessidade);


// ======================
// 🤝 DOAÇÕES
// ======================

// público
router.get('/doacoes', listarDoacoes);

// usuário + admin
router.post(
  '/doacoes',
  authMiddleware,
  permit('user', 'admin'),
  doacaoLimiter,
  registrarDoacao
);

// só admin pode deletar
router.delete('/doacoes/:id', authMiddleware, permit('admin'), deletarDoacao);


// ======================
// 👑 ADMIN
// ======================

// 🚫 IPs
router.get('/admin/ips', authMiddleware, permit('admin'), listarIPsBloqueados);
router.delete('/admin/ip/:ip', authMiddleware, permit('admin'), desbloquearIP);

// 📋 solicitações de ponto
router.get('/admin/solicitacoes', authMiddleware, permit('admin'), listarSolicitacoes);

// ✅ aprovar ponto
router.patch('/admin/aprovar/:id', authMiddleware, permit('admin'), aprovarPonto);

// ❌ rejeitar ponto
router.patch('/admin/rejeitar/:id', authMiddleware, permit('admin'), rejeitarPonto);


export default router;