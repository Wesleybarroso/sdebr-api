import { connectDB } from '../database/db.js';

export async function limparIPsExpirados() {
  try {
    const db = await connectDB();

    const result = await db.run(`
      DELETE FROM ips_bloqueados
      WHERE expires_at < datetime('now')
    `);

    console.log(`🧹 IPs expirados removidos: ${result.changes}`);
  } catch (err) {
    console.error('Erro ao limpar IPs:', err.message);
  }
}