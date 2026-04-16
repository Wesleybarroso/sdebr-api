import { connectDB } from '../database/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// 🔥 NOVO: config centralizada
import { JWT_CONFIG } from '../config/jwt.js';


// ======================
// 👤 REGISTER
// ======================
export async function register(req, res) {
  try {
    let { nome, email, senha, quer_ser_ponto } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: 'Preencha todos os campos'
      });
    }

    // 🔥 normalizar email
    email = email.toLowerCase().trim();

    const db = await connectDB();

    const user = await db.get(
      'SELECT * FROM usuarios WHERE email=?',
      [email]
    );

    if (user) {
      return res.status(400).json({
        error: 'Email já cadastrado'
      });
    }

    // 🔐 criptografia
    const senhaHash = await bcrypt.hash(senha, 10);

    let role = 'user';
    let status = 'ativo';

    if (quer_ser_ponto) {
      status = 'pendente';
    }

    await db.run(
      'INSERT INTO usuarios (nome, email, senha, role, status) VALUES (?, ?, ?, ?, ?)',
      [nome, email, senhaHash, role, status]
    );

    res.json({
      message: quer_ser_ponto
        ? 'Cadastro realizado! Aguarde aprovação para se tornar um ponto de coleta.'
        : 'Usuário cadastrado com sucesso'
    });

  } catch (err) {
    console.error('Erro no register:', err);
    res.status(500).json({
      error: 'Erro interno no servidor'
    });
  }
}


// ======================
// 🔐 LOGIN
// ======================
export async function login(req, res) {
  try {
    let { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Informe email e senha'
      });
    }

    // 🔥 normalizar email
    email = email.toLowerCase().trim();

    const db = await connectDB();

    const user = await db.get(
      'SELECT * FROM usuarios WHERE email=?',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // 🔐 valida senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      });
    }

    // 🚫 bloqueio se pendente
    if (user.status === 'pendente') {
      return res.status(403).json({
        error: 'Seu cadastro como ponto ainda está em análise'
      });
    }

    // 🎟️ TOKEN (AGORA COM CONFIG)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      JWT_CONFIG.secret,
      {
        expiresIn: JWT_CONFIG.expiresIn
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({
      error: 'Erro interno no servidor'
    });
  }
}