# Sistema de Gerenciamento de Hotel - Versão MySQL

Este projeto foi atualizado para utilizar um banco de dados **MySQL** ao invés de localStorage. O sistema agora possui um backend completo com API REST e autenticação JWT.
# Sistema de Gerenciamento de Hotel - Versão MySQL

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 14 ou superior)
- **MySQL Server** (versão 5.7 ou superior)
- **npm** ou **yarn**

## Configuração do Banco de Dados

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

## Instalação e Execução

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

## API

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

## Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação. Após o login ou registro, o token é armazenado no localStorage e enviado no header de todas as requisições autenticadas:

```
Authorization: Bearer <token>
```

## Tecnologias Utilizadas

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

