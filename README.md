# 🎵 Studio API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![License](https://img.shields.io/badge/license-ISC-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

API RESTful para gerenciamento de estúdios de ensaio e agendamentos, desenvolvida como prática de back-end com Node.js, Express e MongoDB.

---

## 🚀 Tecnologias utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- ESLint + Prettier (padronização de código)
- Husky + lint-staged (hooks de commit)

---

## 📁 Estrutura de pastas

```bash
meu-projeto/
├── src/
│   ├── controllers/ # Lógica dos endpoints (studios, agendamentos)
│   ├── models/ # Modelos do Mongoose
│   ├── routes/ # Arquivos de rota da API
│   ├── config/ # Configuração do banco de dados
│   ├── app.js # Configuração principal do Express
│   └── ...
├── .env
├── .env.example # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
├── server.js # Ponto de entrada da aplicação
└── README.md
```

---

## ⚙️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/lucas-romeiro/studio-booking-api
cd studio-booking-api
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo .env:

Crie um arquivo .env na raiz baseado no .env.example:

```env
MONGODB_URI=mongodb+srv://usuario:<db_password>@cluster.mongodb.net/studio
MONGODB_PASSWORD=sua_senha
PORT=3000
```

## ▶️ Execução

Para iniciar a aplicação em modo de desenvolvimento com nodemon:

```bash
npm start
```

A API estará disponível em:

```bash
http://localhost:3000/api/v1/
```

## 📌 Endpoints principais

| Método | Rota                 | Descrição                    |
| ------ | -------------------- | ---------------------------- |
| GET    | /api/v1/studios      | Listar todos os estúdios     |
| POST   | /api/v1/studios      | Criar novo estúdio           |
| GET    | /api/v1/studios/:id  | Buscar estúdio por ID        |
| PATCH  | /api/v1/studios/:id  | Atualizar estúdio por ID     |
| DELETE | /api/v1/studios/:id  | Deletar estúdio por ID       |
| GET    | /api/v1/bookings     | Listar agendamentos          |
| POST   | /api/v1/bookings     | Criar novo agendamento       |
| GET    | /api/v1/bookings/:id | Buscar agendamento por ID    |
| PATCH  | /api/v1/bookings/:id | Atualizar agendamento por ID |
| DELETE | /api/v1/bookings/:id | Deletar agendamento por ID   |

## 🔍 Padronização de código

Este projeto usa:

- ESLint com Airbnb Style Guide
- Prettier
- Husky + lint-staged para rodar o lint antes dos commits

## 🧪 Exemplos de requisição

```json
// POST /api/v1/studios
{
  "nome": "Studio Alpha",
  "localizacao": "Rua das Bandas, 123",
  "capacidade": 15
}
```

```json
// POST /api/v1/bookings
{
  "studio": "6642fd58c7f98156bbf5a9a3",
  "usuario": "João Silva",
  "dataInicio": "2025-05-14T14:00:00.000Z",
  "dataFim": "2025-05-14T16:00:00.000Z",
  "observacoes": "Chegar com 15 minutos de antecedência"
}
```

## 🧑‍💻 Autor

Lucas Romeiro
Desenvolvedor Back-End em formação

## Status

Em desenvolvimento (MVP funcional concluído)
