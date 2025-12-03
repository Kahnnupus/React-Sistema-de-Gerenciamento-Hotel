# Sistema de Gerenciamento de Hotel - Versão 3.0 (MongoDB)

Este projeto foi migrado de MySQL para MongoDB. Siga as instruções abaixo para rodar o projeto.

## Pré-requisitos

-   [Node.js](https://nodejs.org/) (v14 ou superior)
-   [MongoDB](https://www.mongodb.com/try/download/community) (rodando localmente na porta 27017 ou configure a URI no `.env`)

## Configuração e Instalação

### 1. Configurar o Backend

1.  Navegue até a pasta `backend`:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Crie um arquivo `.env` na pasta `backend` (se não existir) com as seguintes variáveis (ajuste conforme necessário):
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/hotel_management
    JWT_SECRET=sua_chave_secreta_aqui
    ```

4.  Inicialize o banco de dados (Cria o usuário administrador):
    ```bash
    node scripts/seedMongoDB.js
    ```

    **Você verá:**
    ```
    MongoDB Conectado: localhost
    Usuário administrador criado
       Email: admin@hotel.com
       Senha: admin
    Banco de dados MongoDB inicializado com sucesso!
    ```

5.  Inicie o servidor backend:
    ```bash
    npm start
    ```

    **Você verá:**
    ```
    Servidor rodando na porta 5000
    URL: http://localhost:5000
    MongoDB Conectado: localhost
    ```

### 2. Configurar o Frontend

1.  Abra um **novo terminal** e navegue até a pasta `frontend` (se estiver no backend, volte um nível e entre em frontend):
    ```bash
    cd ../frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie o frontend:
    ```bash
    npm start
    ```

    O navegador abrirá automaticamente em `http://localhost:3000`.

---

## Acessos Disponíveis

### Administrador Padrão
```
Email: admin@hotel.com
Senha: admin
```
*(Nota: A senha padrão foi alterada de 'root' para 'admin' na migração)*

**O que o admin pode fazer:**
- Aprovar/reprovar hotéis cadastrados
- Gerenciar todos os usuários
- Tornar usuários administradores
- Ver estatísticas do sistema
- Deletar hotéis e usuários

### Criar Conta de Usuário Normal
1. Clique em **"Registrar"**
2. Preencha seus dados
3. Você será automaticamente logado e redirecionado

---

## Principais Mudanças (V3 - MongoDB)

-   **Banco de Dados**: Migrado de MySQL para MongoDB.
-   **ORM**: Substituído `mysql2` por `mongoose`.
-   **Estrutura de Dados**:
    -   Tabelas convertidas para Coleções (`users`, `hotels`, `roomtypes`, `reservations`, `contactmessages`).
    -   Relacionamentos mantidos através de referências (`ObjectId`).
    -   Comodidades agora são um array de strings dentro do documento do Hotel, simplificando a estrutura.

---

## Fluxo de Cadastro de Hotel

### Para Usuários

1. Faça login
2. Vá para **"Cadastrar Hotel"**
3. Preencha as informações básicas
4. **IMPORTANTE:** Crie pelo menos 1 tipo de quarto:
   - Nome (ex: "Quarto Standard")
   - Descrição
   - Preço por noite
   - Capacidade de pessoas
   - Quantidade disponível
5. Adicione comodidades (opcional)
6. Clique em **"Cadastrar"**

**Status:** Hotel ficará **"Aguardando Aprovação"**

### Para Administradores

1. Faça login como admin
2. Vá para **Dashboard Administrativo** (`/admin`)
3. Clique em **"Hotéis Pendentes"**
4. Revise o hotel cadastrado
5. Clique em **"Aprovar"**

**Resultado:** Hotel aparece para todos os usuários!

---

## Solução de Problemas Comuns

### "Erro ao conectar ao MongoDB"
- Verifique se o serviço do MongoDB está rodando.
- Verifique se a `MONGO_URI` no `.env` está correta.

### "Usuário admin não funciona"
- Certifique-se de ter rodado `node scripts/seedMongoDB.js`.
- A senha padrão é `admin`.

### "Hotel não aparece na listagem"
- Verifique se o hotel foi aprovado pelo administrador.
