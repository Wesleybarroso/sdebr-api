import { connectDB } from '../database/db.js';


// ======================
// ➕ CRIAR
// ======================
export async function criarNecessidade(req, res) {
  const { ponto_id, tipo, quantidade, urgencia, status } = req.body;
  const db = await connectDB();

  const ponto = await db.get(
    'SELECT * FROM pontos WHERE id = ?',
    [ponto_id]
  );

  if (!ponto) {
    return res.status(404).json({ error: 'Ponto não encontrado' });
  }

  if (ponto.user_id !== req.user.id) {
    return res.status(403).json({
      error: 'Você não pode adicionar necessidade neste ponto'
    });
  }

  // 🔥 NOVO (sem remover nada)
  await db.run(
    `INSERT INTO necessidades 
     (ponto_id, tipo, quantidade, quantidade_restante, porcentagem, urgencia, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ponto_id,
      tipo,
      quantidade,
      quantidade, // começa igual
      0,          // 0% no início
      urgencia,
      status || 'precisando'
    ]
  );

  res.json({ message: 'Necessidade cadastrada' });
}


// ======================
// 📋 LISTAR
// ======================
export async function listarNecessidades(req, res) {
  const db = await connectDB();

  const data = await db.all(`
    SELECT 
      n.*, 
      p.nome, 
      p.cidade,
      (n.quantidade - n.quantidade_restante) AS doado
    FROM necessidades n
    JOIN pontos p ON n.ponto_id = p.id
  `);

  res.json(data);
}


// ======================
// 🔍 BUSCAR POR ID
// ======================
export async function buscarNecessidade(req, res) {
  const db = await connectDB();

  const necessidade = await db.get(
    'SELECT * FROM necessidades WHERE id=?',
    [req.params.id]
  );

  if (!necessidade) {
    return res.status(404).json({ error: 'Não encontrada' });
  }

  res.json(necessidade);
}


// ======================
// ✏️ ATUALIZAR
// ======================
export async function atualizarNecessidade(req, res) {
  const db = await connectDB();
  const { id } = req.params;

  const necessidade = await db.get(
    'SELECT * FROM necessidades WHERE id=?',
    [id]
  );

  if (!necessidade) {
    return res.status(404).json({ error: 'Não encontrada' });
  }

  const ponto = await db.get(
    'SELECT * FROM pontos WHERE id=?',
    [necessidade.ponto_id]
  );

  if (ponto.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Você não pode alterar essa necessidade'
    });
  }

  const { status, urgencia, quantidade } = req.body;

  let restante = necessidade.quantidade_restante;

  // 🔥 se mudar quantidade total
  if (quantidade && quantidade !== necessidade.quantidade) {
    restante = quantidade;
  }

  // 📊 calcular %
  const porcentagem = Math.floor(
    ((quantidade - restante) / quantidade) * 100
  );

  await db.run(
    `UPDATE necessidades 
     SET quantidade=?, quantidade_restante=?, porcentagem=?, urgencia=?, status=? 
     WHERE id=?`,
    [quantidade, restante, porcentagem, urgencia, status, id]
  );

  res.json({ message: 'Necessidade atualizada' });
}


// ======================
// ❌ DELETAR
// ======================
export async function deletarNecessidade(req, res) {
  const db = await connectDB();
  const { id } = req.params;

  const necessidade = await db.get(
    'SELECT * FROM necessidades WHERE id=?',
    [id]
  );

  if (!necessidade) {
    return res.status(404).json({ error: 'Necessidade não encontrada' });
  }

  const ponto = await db.get(
    'SELECT * FROM pontos WHERE id=?',
    [necessidade.ponto_id]
  );

  if (ponto.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Você não pode apagar essa necessidade'
    });
  }

  await db.run('DELETE FROM necessidades WHERE id=?', [id]);

  res.json({ message: 'Necessidade deletada com sucesso' });
}