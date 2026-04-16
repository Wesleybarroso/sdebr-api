import { connectDB } from '../database/db.js';


// ======================
// 🚫 IPS BLOQUEADOS
// ======================

// listar IPs
export async function listarIPsBloqueados(req, res) {
  const db = await connectDB();

  const ips = await db.all(`
    SELECT * FROM ips_bloqueados
    ORDER BY blocked_at DESC
  `);

  res.json(ips);
}


// 🔓 desbloquear IP manual
export async function desbloquearIP(req, res) {
  const { ip } = req.params;
  const db = await connectDB();

  const existe = await db.get(
    'SELECT * FROM ips_bloqueados WHERE ip=?',
    [ip]
  );

  if (!existe) {
    return res.status(404).json({
      error: 'IP não encontrado'
    });
  }

  await db.run(
    'DELETE FROM ips_bloqueados WHERE ip=?',
    [ip]
  );

  res.json({ message: 'IP desbloqueado com sucesso ✅' });
}


// ======================
// 👤 APROVAÇÃO DE PONTOS
// ======================

// listar solicitações
export async function listarSolicitacoes(req, res) {
  const db = await connectDB();

  const users = await db.all(`
    SELECT id, nome, email, status
    FROM usuarios
    WHERE status='pendente'
  `);

  res.json(users);
}


// ✅ aprovar usuário como ponto
export async function aprovarPonto(req, res) {
  const { id } = req.params;
  const db = await connectDB();

  const user = await db.get(
    'SELECT * FROM usuarios WHERE id=?',
    [id]
  );

  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (user.status === 'ativo' && user.role === 'ponto') {
    return res.status(400).json({
      error: 'Usuário já é um ponto'
    });
  }

  await db.run(
    `UPDATE usuarios 
     SET status='ativo', role='ponto' 
     WHERE id=?`,
    [id]
  );

  res.json({ message: 'Usuário aprovado como ponto ✅' });
}


// ❌ rejeitar solicitação
export async function rejeitarPonto(req, res) {
  const { id } = req.params;
  const db = await connectDB();

  const user = await db.get(
    'SELECT * FROM usuarios WHERE id=?',
    [id]
  );

  if (!user) {
    return res.status(404).json({
      error: 'Usuário não encontrado'
    });
  }

  await db.run(
    `UPDATE usuarios 
     SET status='rejeitado' 
     WHERE id=?`,
    [id]
  );

  res.json({ message: 'Solicitação rejeitada ❌' });
}