# Sistema de Gerenciamento de Hotel (MongoDB)

Bem-vindo ao Sistema de Gerenciamento de Hotel. Este projeto é uma aplicação completa para gerenciamento de reservas, hotéis e usuários, utilizando **React** no frontend e **Node.js/Express** com **MongoDB** no backend.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

-   [Node.js](https://nodejs.org/) (Versão 14 ou superior)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Deve estar rodando localmente na porta `27017` ou configurado via `.env`)

---

## Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente.

### 1. Configuração do Backend

1.  Abra o terminal e entre na pasta `backend`:
    ```bash
    cd backend
    ```

2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente. Crie um arquivo `.env` na **raiz do projeto** (fora da pasta backend) com o seguinte conteúdo:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/hotel_management
    JWT_SECRET=sua_chave_secreta_super_segura
    ```

4.  Inicialize o banco de dados com dados de teste e o usuário administrador:
    ```bash
    node scripts/seedMongoDB.js
    ```
    >**Sucesso:** Você verá mensagens confirmando a conexão e a criação do usuário admin.

5.  Inicie o servidor:
    ```bash
    npm start
    ```
    > O servidor rodará em `http://localhost:5000`.

### 2. Configuração do Frontend

1.  Abra um **novo terminal** e entre na pasta `frontend`:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação React:
    ```bash
    npm start
    ```
    > O navegador abrirá automaticamente em `http://localhost:3000`.

---

## Instruções de Utilização

### Acesso Administrativo

Para gerenciar o sistema, utilize a conta de administrador padrão criada pelo script de inicialização:

-   **Email:** `admin@hotel.com`
-   **Senha:** `admin`

### Funcionalidades do Sistema

#### 1. Cadastro de Usuários
-   Qualquer pessoa pode criar uma conta clicando em "Registrar".
-   Usuários normais podem visualizar hotéis e fazer reservas.

#### 2. Cadastro de Hotéis (Parceiros)
-   Usuários logados podem cadastrar seus hotéis.
-   **Importante:** Ao cadastrar um hotel, é obrigatório adicionar pelo menos um **Tipo de Quarto** (ex: Standard, Luxo) com preço e capacidade.
-   Novos hotéis ficam com status **"Pendente"** até serem aprovados por um administrador.

#### 3. Aprovação de Hotéis (Admin)
-   Acesse o sistema com a conta de administrador.
-   Vá para o **Dashboard**.
-   Em "Hotéis Pendentes", revise os dados e clique em **Aprovar**.
-   Após aprovação, o hotel ficará visível para todos os usuários na página inicial.

#### 4. Realizando Reservas
-   Na página inicial, clique em um hotel para ver detalhes.
-   Selecione as datas de entrada e saída.
-   Escolha o tipo de quarto.
-   Confirme a reserva.
-   Você pode visualizar suas reservas na página "Minhas Reservas".

---

## Tecnologias Utilizadas

-   **Frontend:** React, CSS Modules (com transições e animações).
-   **Backend:** Node.js, Express.
-   **Banco de Dados:** MongoDB (Mongoose).
-   **Autenticação:** JWT (JSON Web Tokens).

## Solução de Problemas

-   **Erro de Conexão (MongoNetworkError):** Verifique se o MongoDB está rodando (`mongod`).
-   **Login Falhou:** Verifique se rodou o script `seedMongoDB.js` para criar o usuário admin.
-   **Hotel não aparece:** Verifique se ele foi aprovado pelo administrador.
