# Sistema de Gerenciamento de Hotel (React)

## Visão Geral

Este projeto é uma aplicação web front-end completa, construída com React, que simula um sistema de gerenciamento e reserva de hotéis. A aplicação é totalmente client-side, utilizando a Context API do React para gerenciamento de estado global e o `localStorage` do navegador para persistir dados, simulando sessões de usuário, bancos de dados de usuários e listas de hotéis.

O projeto utiliza `react-router-dom` para navegação e é estilizado com `Tailwind CSS`, incluindo um sistema de tema (modo claro e escuro) funcional.

## Principais Funcionalidades

### 1. Autenticação e Gerenciamento de Usuário
* **Registro de Conta:** Os usuários podem criar uma nova conta fornecendo nome, e-mail, telefone, endereço e senha. O formulário inclui validação de formato para e-mail e telefone.
* **Login de Usuário:** Sistema de login que autentica o usuário com base nos dados salvos no `localStorage`.
* **Persistência de Sessão:** O estado de autenticação é mantido entre as recargas da página usando o `localStorage`.
* **Rotas Protegidas:** A aplicação protege suas rotas. Usuários não autenticados são restritos às páginas de Login e Registro.
* **Gerenciamento de Perfil:** Usuários autenticados podem visualizar e atualizar suas informações de perfil (nome, e-mail, telefone, endereço e foto) através do Dashboard.

### 2. Gerenciamento de Hotéis (CRUD)
* **Listagem e Filtragem:** A página `/hoteis` exibe todos os hotéis disponíveis e permite a filtragem em tempo real por nome, localização ou descrição.
* **Busca na Home:** A página inicial (`/`) permite uma busca por destino, que redireciona para a página de listagem com o termo de busca pré-aplicado como um parâmetro de URL (`?city=...`).
* **Visualização de Detalhes:** Cada hotel possui uma página de detalhes (`/hoteis/:id`) que exibe informações completas, incluindo descrição, comodidades, imagem e os tipos de quartos com seus respectivos preços.
* **Adicionar Hotel:** Um formulário protegido (`/add-hotel`) permite adicionar novos hotéis ao sistema. Este formulário inclui uma interface dinâmica para adicionar múltiplos tipos de quartos (nome, preço, quantidade, limite de hóspedes) ao novo hotel.

### 3. Sistema de Reservas
* **Formulário de Reserva:** Ao visualizar os detalhes de um hotel, o usuário pode clicar em "Reservar" para acessar o formulário de reserva (`/reserva/:id`).
* **Seleção de Quarto e Datas:** O usuário pode selecionar o tipo de quarto, datas de check-in e check-out, e o número de hóspedes.
* **Validação Dinâmica:** O formulário valida o número de hóspedes com base no limite do quarto selecionado e verifica a disponibilidade.
* **Cálculo de Preço:** O preço total é calculado automaticamente com base no preço por noite do quarto e no número de diárias.
* **Confirmação:** Ao confirmar, a reserva é salva no `ReservationContext`.

### 4. Interface e Experiência do Usuário (UX)
* **Design Responsivo:** A aplicação utiliza Tailwind CSS para se adaptar a diferentes tamanhos de tela.
* **Modo Claro/Escuro (Theme Toggling):** A aplicação possui um seletor de tema (light/dark) que persiste a escolha do usuário no `localStorage` e aplica o tema globalmente.
* **Navegação:** Roteamento claro e intuitivo usando `react-router-dom`.
* **Feedback Visual:** A interface exibe animações de transição de página e mensagens de confirmação (ex: "Reserva realizada com sucesso").

## Tech Stack (Principais Tecnologias)

* **React:** Biblioteca principal para construção da interface.
* **React Hooks:** Utilização extensiva de `useState`, `useEffect`, `useContext` e `useMemo` para estado e lógica.
* **React Router (`react-router-dom`):** Para roteamento de páginas e navegação.
* **React Context API:** Para gerenciamento de estado global de forma centralizada (Auth, Hotels, Reservations, Theme).
* **Tailwind CSS:** Framework de estilização utility-first.
* **LocalStorage:** Utilizado como banco de dados simulado para persistência de dados no navegador.
