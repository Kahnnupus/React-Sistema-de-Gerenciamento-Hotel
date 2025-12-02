# Sistema de Gerenciamento de Hotel - Versão MySQL

Este projeto foi atualizado para utilizar um banco de dados **MySQL** ao invés de localStorage. O sistema agora possui um backend completo com API REST e autenticação JWT.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 14 ou superior)
- **MySQL Server** (versão 5.7 ou superior)
- **npm** ou **yarn**

## 🗄️ Configuração do Banco de Dados

### 1. Verificar MySQL

Certifique-se de que o MySQL está rodando e acessível com as seguintes credenciais:

```
Host: localhost
Port: 3306
User: root
Password: root
```

### 2. Inicializar o Banco de Dados

O projeto inclui um script SQL completo que cria o banco de dados, tabelas e insere dados iniciais.

**Opção A: Usando o script Node.js (Recomendado)**

```bash
cd backend
npm install
npm run init-db
```

**Opção B: Executando o SQL manualmente**

```bash
mysql -u root -p < database/init.sql
```

Quando solicitado, digite a senha: `root`

### 3. Estrutura do Banco de Dados

O script cria as seguintes tabelas:

- **users** - Usuários do sistema
- **hotels** - Hotéis disponíveis
- **hotel_comodidades** - Comodidades de cada hotel
- **reservations** - Reservas realizadas
- **products** - Produtos disponíveis
- **cart_items** - Itens no carrinho de compras

## 🚀 Instalação e Execução

### Backend (API)

1. Navegue até a pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (já configurado no arquivo `.env`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hotel_management
JWT_SECRET=seu_segredo_jwt_super_secreto_aqui_mude_em_producao
```

4. Inicie o servidor:

```bash
npm start
```

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:5000`

### Frontend (React)

1. Em um novo terminal, navegue até a raiz do projeto:

```bash
cd ..
```

2. Instale as dependências:

```bash
npm install
```

3. Configure a URL da API (já configurado no arquivo `.env`):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Inicie o aplicativo React:

```bash
npm start
```

O aplicativo estará rodando em: `http://localhost:3000`

## 📡 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário (requer autenticação)
- `PUT /api/auth/profile` - Atualizar perfil (requer autenticação)

### Hotéis

- `GET /api/hotels` - Listar todos os hotéis
- `GET /api/hotels/:id` - Buscar hotel por ID
- `POST /api/hotels` - Criar novo hotel (requer autenticação)
- `PUT /api/hotels/:id` - Atualizar hotel (requer autenticação)
- `DELETE /api/hotels/:id` - Deletar hotel (requer autenticação)

### Reservas

- `GET /api/reservations` - Listar reservas do usuário (requer autenticação)
- `GET /api/reservations/:id` - Buscar reserva por ID (requer autenticação)
- `POST /api/reservations` - Criar nova reserva (requer autenticação)
- `PUT /api/reservations/:id` - Atualizar reserva (requer autenticação)
- `DELETE /api/reservations/:id` - Cancelar reserva (requer autenticação)

### Produtos

- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Buscar produto por ID
- `POST /api/products` - Criar novo produto (requer autenticação)
- `PUT /api/products/:id` - Atualizar produto (requer autenticação)
- `DELETE /api/products/:id` - Deletar produto (requer autenticação)

### Carrinho

- `GET /api/cart` - Listar itens do carrinho (requer autenticação)
- `POST /api/cart` - Adicionar item ao carrinho (requer autenticação)
- `PUT /api/cart/:id` - Atualizar quantidade (requer autenticação)
- `DELETE /api/cart/:id` - Remover item do carrinho (requer autenticação)

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação. Após o login ou registro, o token é armazenado no localStorage e enviado no header de todas as requisições autenticadas:

```
Authorization: Bearer <token>
```

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Driver MySQL para Node.js
- **bcryptjs** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **cors** - Habilitar CORS
- **dotenv** - Variáveis de ambiente

### Frontend

- **React** - Biblioteca JavaScript para UI
- **React Router** - Roteamento
- **Context API** - Gerenciamento de estado
- **Tailwind CSS** - Framework CSS

## 📝 Mudanças Principais

### Removido

- ❌ localStorage para armazenamento de dados
- ❌ Lógica de autenticação no frontend

### Adicionado

- ✅ Backend completo com API REST
- ✅ Banco de dados MySQL
- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ Validação de dados
- ✅ Relacionamentos entre tabelas
- ✅ Índices para otimização de consultas

## 🔧 Troubleshooting

### Erro de conexão com MySQL

Se você receber um erro de conexão, verifique:

1. MySQL está rodando: `sudo service mysql status`
2. Credenciais estão corretas no arquivo `.env`
3. Porta 3306 está disponível

### Erro "ER_NOT_SUPPORTED_AUTH_MODE"

Se você receber este erro, execute no MySQL:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
FLUSH PRIVILEGES;
```

### Backend não inicia

1. Verifique se todas as dependências foram instaladas: `npm install`
2. Verifique se o banco de dados foi inicializado
3. Verifique os logs de erro no console

### Frontend não conecta ao backend

1. Verifique se o backend está rodando na porta 5000
2. Verifique o arquivo `.env` do frontend
3. Verifique o console do navegador para erros de CORS

## 📦 Estrutura de Pastas

```
React-Sistema-de-Gerenciamento-Hotel/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuração do MySQL
│   ├── middleware/
│   │   └── auth.js               # Middleware de autenticação JWT
│   ├── routes/
│   │   ├── auth.js               # Rotas de autenticação
│   │   ├── hotels.js             # Rotas de hotéis
│   │   ├── reservations.js       # Rotas de reservas
│   │   ├── products.js           # Rotas de produtos
│   │   └── cart.js               # Rotas de carrinho
│   ├── scripts/
│   │   └── initDatabase.js       # Script de inicialização do BD
│   ├── .env                      # Variáveis de ambiente
│   ├── package.json
│   └── server.js                 # Servidor principal
├── database/
│   └── init.sql                  # Script SQL de inicialização
├── src/
│   ├── components/               # Componentes React
│   ├── contexts/                 # Contexts atualizados para usar API
│   │   ├── AuthContext.js
│   │   ├── HotelContext.js
│   │   ├── ReservationContext.js
│   │   ├── ProductContext.js
│   │   └── CartContext.js
│   ├── config/
│   │   └── api.js                # Configuração da URL da API
│   └── ...
├── .env                          # Variáveis de ambiente do frontend
└── README_MYSQL.md               # Este arquivo
```

## 🚀 Deploy em Produção

Para deploy em produção, lembre-se de:

1. Alterar o `JWT_SECRET` no `.env` do backend
2. Configurar as credenciais do MySQL de produção
3. Atualizar a `REACT_APP_API_URL` no frontend
4. Usar HTTPS para comunicação segura
5. Configurar variáveis de ambiente no servidor
6. Fazer build do frontend: `npm run build`

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando React, Node.js e MySQL**
