# 🚀 SDEBR API — Sistema de Doações Especializado Brasileiro

API backend completa para gerenciamento de doações, pontos de coleta e necessidades em tempo real.

---

# 📌 Visão Geral

O **SDEBR** é um sistema que conecta:

- Pessoas que querem doar
- Pontos de coleta que precisam de recursos

Permitindo transparência, organização e eficiência nas doações.

---

# 🎯 Problema que resolve

Evita:

❌ Doações desnecessárias  
❌ Desorganização  
❌ Falta de informação  
❌ Desperdício  

---

# 🧠 Como funciona

1. Usuário se cadastra  
2. Pode solicitar ser ponto de coleta  
3. Admin aprova  
4. Ponto cadastra necessidades  
5. Usuários realizam doações  
6. Sistema atualiza progresso automaticamente  

---

# 🛠️ Tecnologias Utilizadas

## 🔹 Backend
- Node.js → runtime JavaScript  
- Express → framework HTTP  

## 🔹 Banco
- SQLite → banco leve e rápido  

## 🔹 Autenticação
- jsonwebtoken (JWT)  

## 🔹 Segurança
- bcrypt → hash de senha  
- cors → controle de acesso web  
- helmet → proteção de headers HTTP  
- express-rate-limit → anti-spam  

## 🔹 Validação
- zod → validação de dados  

---

# 🔐 Segurança Implementada

- Autenticação JWT  
- Controle de roles (admin, ponto, user)  
- Senhas criptografadas  
- Rate limit global  
- Rate limit em doações  
- Bloqueio automático de IP  
- Expiração automática de IP bloqueado  
- Validação de dados  
- CORS controlado  
- Helmet (segurança HTTP)  
- Controle de ownership (usuário só acessa seus dados)  

---

# 👤 Tipos de Usuário

| Tipo   | Permissões |
|--------|-----------|
| user   | Doar |
| ponto  | Criar necessidades |
| admin  | Controle total |

---

# 📦 Estrutura do Projeto

```
SDEBR-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   └── app.js
│
├── database.sqlite
├── server.js
├── package.json
├── README.md
```

---

# 🗄️ Banco de Dados (SQLite)

## 📌 usuarios
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
nome TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
senha TEXT NOT NULL,
role TEXT DEFAULT 'user',
status TEXT DEFAULT 'ativo',
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

## 📌 pontos
```sql
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
```

## 📌 necessidades
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
ponto_id INTEGER,
tipo TEXT NOT NULL,
quantidade INTEGER NOT NULL,
quantidade_restante INTEGER,
porcentagem INTEGER,
urgencia TEXT,
status TEXT,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (ponto_id) REFERENCES pontos(id) ON DELETE CASCADE
```

## 📌 doacoes
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
ponto_id INTEGER,
tipo TEXT NOT NULL,
quantidade INTEGER NOT NULL,
data DATETIME DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (ponto_id) REFERENCES pontos(id) ON DELETE CASCADE
```

## 📌 ips_bloqueados
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
ip TEXT NOT NULL,
blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
expires_at DATETIME NOT NULL
```

---

# 📡 Rotas da API

## 🔐 Auth
- POST /api/register  
- POST /api/login  

## 📍 Pontos
- GET /api/pontos  
- POST /api/pontos  
- PUT /api/pontos/:id  
- DELETE /api/pontos/:id  

## 📦 Necessidades
- GET /api/necessidades  
- POST /api/necessidades  
- PATCH /api/necessidades/:id  
- DELETE /api/necessidades/:id  

## 🤝 Doações
- GET /api/doacoes  
- POST /api/doacoes  
- DELETE /api/doacoes/:id  

## 👑 Admin
- GET /api/admin/ips  
- DELETE /api/admin/ip/:ip  
- GET /api/admin/solicitacoes  
- PATCH /api/admin/aprovar/:id  
- PATCH /api/admin/rejeitar/:id  

---

# 🚀 Como Rodar o Projeto

## 1. Clonar repositório
```
git clone SEU_REPO
```

## 2. Entrar na pasta
```
cd SDEBR-api
```

## 3. Instalar dependências
```
npm install
```

## 4. Rodar servidor
```
npm run dev
```

## 5. Acessar
```
http://localhost:3000
http://localhost:3000/api
```

---

# 🔐 Variáveis de Ambiente

Crie um arquivo `.env`:

```
JWT_SECRET=sua_chave_secreta
PORT=3000
```

---

# 🌐 Deploy

## 🔥 Render
- Conectar GitHub  
- Build: npm install  
- Start: npm start  

## ☁️ AWS (EC2)
- Instalar Node.js  
- Clonar projeto  
- npm install  
- node server.js  

## 🖥️ VPS
- Instalar Node.js  
- npm install  
- usar PM2:
```
pm2 start server.js
```

---

# 📊 Diferenciais

- Sistema com progresso de doação (%)  
- Urgência automática  
- Segurança avançada  
- Anti-spam com bloqueio de IP  
- Estrutura pronta para produção  

---

# 👨‍💻 Autor

Wesley Barroso Leite 🚀