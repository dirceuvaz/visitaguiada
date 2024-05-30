# Visita Guiada - Regulação Médica Ambulatorial

## Aprendendo antes de usar...
A visita guiada é uma ferramenta intuitiva e educativa de treinamento em regulação médica ambulatorial.

## Descrição
Este projeto é um sistema de gestão administrativa desenvolvido para gerenciar usuários e realizar operações de autenticação, aprovação, bloqueio e gerenciamento de usuários. Inicialmente, o sistema utiliza um banco de dados em formato JSON, mas pode ser facilmente migrado para o MongoDB Atlas para maior escalabilidade e robustez.

## Tecnologias Utilizadas

### Frontend
- **HTML**
- **CSS**
- **Bootstrap 4.5.2**
- **JavaScript**

### Backend
- **Node.js**
- **Express.js**
- **Mongoose (para MongoDB)**
- **Axios**

## Telas do Sistema

### 1. **Landing Page**
   - Logo
   - Título
   - Botão: Acessar Painel
   - Espaço para Imagens
   - Rodapé

### 2. **Tela de Autenticação (Login)**
   - Logo
   - Título
   - Formulário de Login
   - Trocar Senha
   - Rodapé

### 3. **Tela de Troca de Senha**
   - Título
   - Formulário de Troca de Senha
   - Rodapé

### 4. **Tela de Cadastro de Usuário**
   - Logo
   - Título
   - Formulário de Cadastro (Nome Completo, Senha, CPF, CRM, Especialidade, Idade, Email)
   - Rodapé

### 5. **Tela de Gestão Administrativa**
   - Logo
   - Título
   - Visão de Todos os Usuários
   - Editar Página de Ensino de Procedimentos (Tutoriais)
   - Página de Questionários para Testes dos Procedimentos
   - Editar Informações dos Usuários
   - Aprovar Novo Usuário no Sistema
   - Funções de Bloquear, Aprovar, Trocar Senha e Editar Dados dos Usuários

## Rotas da API

### Usuários
- **GET /api/users**: Retorna todos os usuários.
- **POST /api/users**: Cria um novo usuário.
- **PUT /api/users/:id**: Atualiza um usuário existente.
- **DELETE /api/users/:id**: Deleta um usuário.
- **POST /api/users/login**: Autentica um usuário.
- **POST /api/users/reset-password**: Reseta a senha de um usuário.

## Funcionalidades

### 1. **Login**
   - Autenticação de usuários utilizando email e senha.
   - Verificação de aprovação e bloqueio do usuário antes do login.

### 2. **Cadastro de Usuário**
   - Criação de novos usuários com informações como nome completo, senha, CPF, CRM, especialidade, idade e email.
   - Usuários novos precisam ser aprovados por um administrador antes de poderem fazer login.

### 3. **Aprovação de Usuário**
   - Administradores podem aprovar novos usuários, permitindo que eles façam login no sistema.

### 4. **Bloqueio/Desbloqueio de Usuário**
   - Administradores podem bloquear usuários para impedir que eles façam login.
   - Administradores podem desbloquear usuários anteriormente bloqueados.

### 5. **Troca de Senha**
   - Administradores podem resetar a senha de qualquer usuário.

### 6. **Edição de Dados dos Usuários**
   - Administradores podem editar as informações dos usuários, incluindo nome completo, email e papel (role).

## Banco de Dados
### JSON (temporariamente)
Os dados dos usuários são armazenados em um arquivo JSON localizado em `backend/data/users.json`. A estrutura do usuário é a seguinte:

```json
{
  "id": 1,
    "username": "Administrador Root",
    "email": "admin@example.com",
    "password": "adm",
    "role": "admin",
    "cpf": "12345678900",
    "crm": "12345",
    "especialidade": "Administração",
    "idade": 35,
    "approved": true
}
