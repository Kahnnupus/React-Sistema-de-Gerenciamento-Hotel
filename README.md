# 🚀 Guia de Início Rápido - Versão 2.0

## ⚡ Inicialização em 3 Passos

### 1️⃣ Inicializar o Banco de Dados

```bash
cd backend
npm install
npm run init-db
```

**Você verá:**
```
✅ Conectado ao MySQL
✅ Script SQL executado com sucesso
✅ Usuário administrador criado
   Email: admin@hotel.com
   Senha: root
```

### 2️⃣ Iniciar o Backend

```bash
npm start
```

**Você verá:**
```
🚀 Servidor rodando na porta 5000
📍 URL: http://localhost:5000
```

### 3️⃣ Iniciar o Frontend

Em **outro terminal**:

```bash
cd ..
npm install
npm start
```

O navegador abrirá automaticamente em `http://localhost:3000`

---

## 👤 Acessos Disponíveis

### Administrador Padrão
```
Email: admin@hotel.com
Senha: root
```

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

**O que usuários normais podem fazer:**
- Cadastrar hotéis (aguardam aprovação)
- Fazer reservas em hotéis aprovados
- Gerenciar suas reservas
- Contatar administrador
- Editar/deletar seus hotéis

---

## 🏨 Fluxo de Cadastro de Hotel

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

## 📋 Principais Mudanças da V2

### ✅ O que foi adicionado

1. **Sistema de Tipos de Quartos**
   - Cada hotel tem seus próprios tipos
   - Obrigatório criar pelo menos 1 tipo

2. **Aprovação de Hotéis**
   - Hotéis não aparecem até serem aprovados
   - Apenas admin pode aprovar

3. **Dashboard Administrativo**
   - Gerenciar usuários
   - Aprovar hotéis
   - Ver estatísticas

4. **Área do Usuário**
   - Minhas Reservas
   - Meus Hotéis Cadastrados
   - Contatar Administrador

5. **Feedback de Erros**
   - Login mostra erros específicos
   - Registro mostra erros específicos

### ❌ O que foi removido

- Sistema de Produtos
- Carrinho de Compras

---

## 🔍 Testando o Sistema

### Teste 1: Cadastrar Hotel como Usuário

1. Registre-se como usuário normal
2. Cadastre um hotel com 2 tipos de quartos
3. Vá para "Meus Hotéis" → Verá status "Aguardando Aprovação"
4. Tente ver o hotel na listagem pública → **Não aparece**

### Teste 2: Aprovar Hotel como Admin

1. Faça logout
2. Faça login como admin (admin@hotel.com / root)
3. Vá para `/admin/hoteis-pendentes`
4. Aprove o hotel cadastrado
5. Faça logout e login como usuário normal
6. Veja a listagem pública → **Hotel aparece!**

### Teste 3: Fazer Reserva

1. Como usuário normal, vá para "Hotéis"
2. Escolha um hotel aprovado
3. Clique em "Reservar"
4. Preencha:
   - Nome completo
   - Email
   - Telefone
   - Datas
   - Tipo de quarto
5. Confirme a reserva
6. Vá para "Minhas Reservas" → Verá a reserva

### Teste 4: Contatar Administrador

1. Em "Minhas Reservas"
2. Clique em "Contatar Administrador"
3. Escreva uma mensagem
4. Envie
5. Mensagem salva no banco de dados

---

## ❗ Problemas Comuns

### "Erro ao conectar com MySQL"

**Solução:**
```bash
# Linux/Mac
sudo service mysql start

# Windows
net start MySQL
```

### "Hotel não aparece na listagem"

**Motivo:** Hotel não foi aprovado pelo administrador

**Solução:**
1. Faça login como admin
2. Aprove o hotel em `/admin/hoteis-pendentes`

### "Erro: É necessário cadastrar pelo menos um tipo de quarto"

**Motivo:** Você tentou cadastrar hotel sem tipos de quartos

**Solução:**
1. No formulário de cadastro
2. Preencha a seção "Tipos de Quartos"
3. Clique em "Adicionar Tipo de Quarto"
4. Preencha os dados do tipo
5. Depois cadastre o hotel

### "Erro 403: Acesso negado"

**Motivo:** Você tentou acessar área administrativa sem ser admin

**Solução:**
- Faça login como admin (admin@hotel.com / root)
- Ou peça a um admin para tornar você administrador

---

## 📊 Estrutura de Navegação

### Para Usuários Normais
```
/                          → Home
/login                     → Login
/register                  → Registro
/hoteis                    → Listar hotéis aprovados
/hoteis/:id                → Detalhes do hotel
/cadastrar-hotel           → Cadastrar novo hotel
/meus-hoteis               → Meus hotéis cadastrados
/editar-hotel/:id          → Editar meu hotel
/minhas-reservas           → Minhas reservas
/reservar/:id              → Fazer reserva
```

### Para Administradores
```
/admin                     → Dashboard administrativo
/admin/usuarios            → Gerenciar usuários
/admin/hoteis              → Gerenciar hotéis
/admin/hoteis-pendentes    → Hotéis aguardando aprovação
```

---

## 🎯 Casos de Uso Principais

### Caso 1: Proprietário de Hotel

1. Registrar-se no sistema
2. Cadastrar hotel com tipos de quartos
3. Aguardar aprovação do admin
4. Após aprovação, gerenciar reservas
5. Editar informações do hotel quando necessário

### Caso 2: Hóspede

1. Registrar-se no sistema
2. Buscar hotéis disponíveis
3. Ver tipos de quartos e preços
4. Fazer reserva com dados pessoais
5. Gerenciar reservas
6. Contatar admin se precisar alterar

### Caso 3: Administrador

1. Login com credenciais admin
2. Revisar hotéis pendentes
3. Aprovar hotéis de qualidade
4. Reprovar hotéis inadequados
5. Gerenciar usuários problemáticos
6. Promover usuários confiáveis a admin

---

## 📞 Suporte

### Documentação Completa
- `MUDANCAS_V2.md` - Todas as mudanças detalhadas
- `README_MYSQL.md` - Documentação técnica original

### Logs e Debug
- Backend: Verifique o terminal onde rodou `npm start`
- Frontend: Abra o console do navegador (F12)
- Banco: Use MySQL Workbench ou linha de comando

---

**Sistema pronto para uso! Boa sorte! 🎉**
