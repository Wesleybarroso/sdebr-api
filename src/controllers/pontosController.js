import { connectDB } from '../database/db.js';


// ======================
// 🔥 CRIAR PONTO
// ======================
export async function criarPonto(req, res) {
  const {
    nome,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep,
    complemento,
    descricao
  } = req.body;

  const db = await connectDB();

  const pontos = await db.all(
    'SELECT * FROM pontos WHERE user_id = ?',
    [req.user.id]
  );

  if (pontos.length >= 2) {
    return res.status(400).json({
      error: 'Você só pode ter até 2 pontos de coleta'
    });
  }

  if (pontos.length > 0 && pontos[0].cidade !== cidade) {
    return res.status(400).json({
      error: 'Você só pode criar pontos na mesma cidade'
    });
  }

  const result = await db.run(`
    INSERT INTO pontos 
    (nome, rua, numero, bairro, cidade, estado, cep, complemento, descricao, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    nome,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep,
    complemento,
    descricao,
    req.user.id
  ]);

  res.json({ id: result.lastID });
}


// ======================
// 📋 LISTAR
// ======================
export async function listarPontos(req, res) {
  const db = await connectDB();
  const pontos = await db.all('SELECT * FROM pontos');
  res.json(pontos);
}


// ======================
// ✏️ ATUALIZAR
// ======================
export async function atualizarPonto(req, res) {
  const { id } = req.params;
  const {
    nome,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep,
    complemento,
    descricao
  } = req.body;

  const db = await connectDB();

  const ponto = await db.get(
    'SELECT * FROM pontos WHERE id=?',
    [id]
  );

  if (!ponto) {
    return res.status(404).json({ error: 'Ponto não encontrado' });
  }

  // 🔒 só admin ou dono
  if (req.user.role !== 'admin' && ponto.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  await db.run(`
    UPDATE pontos SET
      nome=?, rua=?, numero=?, bairro=?, cidade=?, estado=?, cep=?, complemento=?, descricao=?
    WHERE id=?
  `, [
    nome,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep,
    complemento,
    descricao,
    id
  ]);

  res.json({ message: 'Ponto atualizado com sucesso' });
}


// ======================
// ❌ DELETAR
// ======================
export async function deletarPonto(req, res) {
  const { id } = req.params;
  const db = await connectDB();

  const ponto = await db.get(
    'SELECT * FROM pontos WHERE id=?',
    [id]
  );

  if (!ponto) {
    return res.status(404).json({ error: 'Ponto não encontrado' });
  }

  // 🔒 só admin ou dono
  if (req.user.role !== 'admin' && ponto.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Sem permissão' });
  }

  await db.run(
    'DELETE FROM pontos WHERE id=?',
    [id]
  );

  res.json({ message: 'Ponto deletado com sucesso' });
}