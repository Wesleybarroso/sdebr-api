# 🚀 SDEBR API — Sistema de Doações Especializado Brasileiro

API backend completa para gerenciamento de doações, pontos de coleta e necessidades em tempo real.

---

# 📌 Visão Geral

O **SDEBR** conecta:

* Pessoas que querem doar 🤝
* Pontos de coleta que precisam de recursos 📦

Permitindo **transparência, organização e eficiência nas doações**.

---

# 🎯 Problema que resolve

Evita:

❌ Doações desnecessárias
❌ Falta de organização
❌ Falta de informação
❌ Desperdício

---

# 🧠 Como funciona

1. Usuário se cadastra
2. Pode solicitar ser ponto de coleta
3. Admin aprova
4. Ponto cadastra necessidades
5. Usuários realizam doações
6. Sistema atualiza progresso automaticamente (%)

---

# 🛠️ Tecnologias Utilizadas

## 🔹 Backend

* Node.js
* Express

## 🔹 Banco

* SQLite

## 🔹 Autenticação

* JWT (jsonwebtoken)

## 🔹 Segurança

* bcrypt → criptografia de senha
* cors → controle de acesso
* helmet → proteção HTTP
* express-rate-limit → anti-spam
* IP Blocker → bloqueio automático de IP
* Cleanup automático de IPs

## 🔹 Validação

* Zod

---

# 🔐 Segurança Implementada

* 🔑 Autenticação com JWT
* 🧠 Controle de roles (admin, ponto, user)
* 🔒 Senhas criptografadas com bcrypt
* 🚫 Rate limit global
* ⚡ Rate limit em doações
* 🛑 Bloqueio automático de IP suspeito
* ⏳ Expiração automática de IP bloqueado
* 🌐 CORS configurado
* 🛡️ Helmet (headers seguros)
* 👤 Controle de ownership (usuário só altera o que é dele)

---

# 👤 Tipos de Usuário

| Tipo  | Permissões                   |
| ----- | ---------------------------- |
| user  | Doar                         |
| ponto | Criar/gerenciar necessidades |
| admin | Controle total               |

---

# 📦 Estrutura do Projeto

```
# 📦 Estrutura do Projeto

```
```bash
SDEBR-api/
├── src/
│   ├── config/        # ⚙️ Configurações globais (JWT, CORS, Logger)
│   ├── controllers/   # 🎯 Regras de negócio (auth, doações, pontos, necessidades, admin)
│   ├── database/      # 🗄️ Conexão e inicialização do banco SQLite
│   ├── middleware/    # 🔐 Segurança (auth, roles, rate limit, ip blocker)
│   ├── routes/        # 🌐 Definição das rotas da API
│   ├── utils/         # 🧹 Funções auxiliares (ex: limpeza de IPs bloqueados)
│   ├── validators/    # ✅ Validação de dados (Zod)
│   └── app.js         # 🚀 Configuração principal do Express
│
├── database.sqlite    # 🗄️ Banco de dados local (não sobe pro Git)
├── server.js          # 🔌 Inicialização do servidor
├── package.json       # 📦 Dependências do projeto
├── README.md          # 📖 Documentação
```

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
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
```

## 📌 doacoes

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
ponto_id INTEGER,
tipo TEXT NOT NULL,
quantidade INTEGER NOT NULL,
data DATETIME DEFAULT CURRENT_TIMESTAMP
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

* POST /api/register
* POST /api/login

## 📍 Pontos

* GET /api/pontos
* POST /api/pontos
* PUT /api/pontos/:id
* DELETE /api/pontos/:id

## 📦 Necessidades

* GET /api/necessidades
* POST /api/necessidades
* PATCH /api/necessidades/:id
* DELETE /api/necessidades/:id

## 🤝 Doações

* GET /api/doacoes
* POST /api/doacoes
* DELETE /api/doacoes/:id

## 👑 Admin

* GET /api/admin/ips
* DELETE /api/admin/ip/:ip
* GET /api/admin/solicitacoes
* PATCH /api/admin/aprovar/:id
* PATCH /api/admin/rejeitar/:id

---

# 📊 Lógica Inteligente do Sistema

✔ Atualização automática de necessidades
✔ Cálculo de quantidade restante
✔ Atualização de status (precisando / ok)
✔ Cálculo de porcentagem de progresso

---

# 🚀 Como Rodar o Projeto

```bash
git clone https://github.com/Wesleybarroso/sdebr-api.git
cd sdebr-api
npm install
npm run dev
```

---

# 🌐 Acessar API

```
http://localhost:3000
http://localhost:3000/api
```

---

# 🔐 Variáveis de Ambiente

Crie `.env`:

```
JWT_SECRET=sua_chave_super_secreta
PORT=3000
```

---

# 🌐 Deploy

## 🔥 Render

* Conectar GitHub
* Build: `npm install`
* Start: `npm start`

## ☁️ AWS (EC2)

* Instalar Node
* Clonar projeto
* npm install
* node server.js

## 🖥️ VPS

```
npm install
pm2 start server.js
```

---

# 📊 Diferenciais

* Sistema com progresso de doação (%)
* Controle de urgência
* Segurança avançada
* Anti-spam com bloqueio automático
* Estrutura pronta para produção

---

# 👨‍💻 Autor

Wesley Barroso Leite 🚀
