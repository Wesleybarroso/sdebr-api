import { connectDB } from '../database/db.js';


// ======================
// 🤝 REGISTRAR DOAÇÃO
// ======================
export async function registrarDoacao(req, res) {
  const { ponto_id, tipo, quantidade } = req.body;
  const db = await connectDB();

  // 🔴 validação básica
  if (!ponto_id || !tipo || !quantidade) {
    return res.status(400).json({
      error: 'Todos os campos são obrigatórios'
    });
  }

  // 🔍 verifica se o ponto existe
  const ponto = await db.get(
    'SELECT * FROM pontos WHERE id=?',
    [ponto_id]
  );

  if (!ponto) {
    return res.status(404).json({
      error: 'Ponto não encontrado'
    });
  }

  // 🔍 busca necessidade relacionada
  const necessidade = await db.get(
    'SELECT * FROM necessidades WHERE ponto_id=? AND tipo=?',
    [ponto_id, tipo]
  );

  // 💾 salva doação
  const result = await db.run(
    'INSERT INTO doacoes (ponto_id, tipo, quantidade) VALUES (?, ?, ?)',
    [ponto_id, tipo, quantidade]
  );

  // 🔥 ATUALIZA NECESSIDADE (AGORA COMPLETO)
  if (necessidade) {
    let restante =
      (necessidade.quantidade_restante ?? necessidade.quantidade) - quantidade;

    if (restante < 0) restante = 0;

    // 📊 calcular porcentagem
    const porcentagem = Math.floor(
      ((necessidade.quantidade - restante) / necessidade.quantidade) * 100
    );

    // 🚦 urgência automática
    let urgencia = 'alta';

    if (porcentagem >= 100) urgencia = 'ok';
    else if (porcentagem >= 70) urgencia = 'baixa';
    else if (porcentagem >= 40) urgencia = 'media';

    // 🧠 status
    let status = 'precisando';
    if (restante === 0) status = 'ok';

    await db.run(
      `UPDATE necessidades 
       SET quantidade_restante=?, porcentagem=?, urgencia=?, status=?, updated_at=CURRENT_TIMESTAMP 
       WHERE id=?`,
      [restante, porcentagem, urgencia, status, necessidade.id]
    );
  }

  res.json({
    message: 'Doação registrada e necessidade atualizada 💛',
    doacao_id: result.lastID
  });
}


// ======================
// 📋 LISTAR DOAÇÕES
// ======================
export async function listarDoacoes(req, res) {
  const db = await connectDB();

  const data = await db.all(`
    SELECT d.*, p.nome, p.cidade
    FROM doacoes d
    JOIN pontos p ON d.ponto_id = p.id
  `);

  res.json(data);
}


// ======================
// ❌ DELETAR DOAÇÃO
// ======================
export async function deletarDoacao(req, res) {
  const { id } = req.params;
  const db = await connectDB();

  const doacao = await db.get(
    'SELECT * FROM doacoes WHERE id=?',
    [id]
  );

  if (!doacao) {
    return res.status(404).json({
      error: 'Doação não encontrada'
    });
  }

  await db.run(
    'DELETE FROM doacoes WHERE id=?',
    [id]
  );

  res.json({
    message: 'Doação deletada com sucesso'
  });
}