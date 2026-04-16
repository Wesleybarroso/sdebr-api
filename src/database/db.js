import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// ======================
// 🔌 CONEXÃO
// ======================
export async function connectDB() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

// ======================
// 🗄️ INICIALIZA BANCO
// ======================
export async function initDB() {
  const db = await connectDB();

  await db.exec(`
    PRAGMA foreign_keys = ON;

    -- ======================
    -- 👤 USUÁRIOS
    -- ======================
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'ativo',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- ======================
    -- 📍 PONTOS
    -- ======================
    CREATE TABLE IF NOT EXISTS pontos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      rua TEXT,
      numero TEXT,
      bairro TEXT,
      cidade TEXT,
      estado TEXT,
      cep TEXT,
      complemento TEXT,
      descricao TEXT,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    -- ======================
    -- 📦 NECESSIDADES (ATUALIZADA)
    -- ======================
    CREATE TABLE IF NOT EXISTS necessidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ponto_id INTEGER,
      tipo TEXT NOT NULL,
      quantidade INTEGER NOT NULL,

      -- 🔥 NOVO (SEM REMOVER NADA)
      quantidade_restante INTEGER,
      porcentagem INTEGER,

      urgencia TEXT,
      status TEXT DEFAULT 'precisando',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (ponto_id) REFERENCES pontos(id) ON DELETE CASCADE
    );

    -- ======================
    -- 🤝 DOAÇÕES
    -- ======================
    CREATE TABLE IF NOT EXISTS doacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ponto_id INTEGER,
      tipo TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      data DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ponto_id) REFERENCES pontos(id) ON DELETE CASCADE
    );

    -- ======================
    -- 🚫 IPS BLOQUEADOS
    -- ======================
    CREATE TABLE IF NOT EXISTS ips_bloqueados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    );

    -- ======================
    -- ⚡ ÍNDICES (PERFORMANCE)
    -- ======================

    CREATE INDEX IF NOT EXISTS idx_usuario_email ON usuarios(email);
    CREATE INDEX IF NOT EXISTS idx_pontos_user ON pontos(user_id);
    CREATE INDEX IF NOT EXISTS idx_necessidades_ponto ON necessidades(ponto_id);
    CREATE INDEX IF NOT EXISTS idx_doacoes_ponto ON doacoes(ponto_id);
    CREATE INDEX IF NOT EXISTS idx_ips ON ips_bloqueados(ip);
    CREATE INDEX IF NOT EXISTS idx_ips_expira ON ips_bloqueados(expires_at);
  `);

  console.log('🗄️ Banco COMPLETO + inteligente + otimizado');
}