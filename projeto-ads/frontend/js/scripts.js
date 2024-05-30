// Função de Logout
function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

// FAZER LOGIN
document.getElementById('loginForm') && document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log(`Tentando fazer login com email: ${email}`);

  axios.post('/api/users/login', { email, password })
    .then(response => {
      const user = response.data.user;
      if (!user.approved) {
        alert('Seu cadastro ainda não foi aprovado pelo administrador.');
        return;
      }
      if (user.blocked) {
        alert('Seu acesso foi bloqueado pelo administrador.');
        return;
      }
      console.log('Resposta do servidor:', response.data);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('loggedIn', 'true');
      window.location.href = 'admin.html';
    })
    .catch(error => {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais.');
    });
});

// CRIAR USUÁRIO
document.getElementById('cadastroForm') && document.getElementById('cadastroForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const cpf = document.getElementById('cpf').value;
  const crm = document.getElementById('crm').value;
  const especialidade = document.getElementById('especialidade').value;
  const idade = document.getElementById('idade').value;

  console.log(`Tentando criar usuário com email: ${email}`);

  axios.post('/api/users', {
    username, email, password, cpf, crm, especialidade, idade, role: 'user', approved: false, blocked: false
  })
  .then(response => {
    alert('Usuário cadastrado com sucesso. Aguarde a aprovação do administrador.');
    window.location.href = 'login.html';
  })
  .catch(error => {
    console.error('Erro ao cadastrar usuário:', error);
    alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
  });
});

// RESETAR SENHA
document.getElementById('resetPasswordForm') && document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const newPassword = document.getElementById('newPassword').value;

  console.log(`Tentando resetar senha para usuário: ${username}`);

  axios.post('/api/users/reset-password', { username, newPassword })
    .then(response => {
      alert('Senha trocada com sucesso.');
      window.location.href = 'login.html';
    })
    .catch(error => {
      console.error('Erro ao trocar senha:', error);
      alert('Erro ao trocar senha. Verifique as informações.');
    });
});

// Verificar se o usuário está logado ao carregar a página admin.html
document.addEventListener('DOMContentLoaded', function() {
  const loggedIn = localStorage.getItem('loggedIn');
  if (window.location.pathname.endsWith('admin.html') && !loggedIn) {
    window.location.href = 'login.html';
    return;
  }

  const userRole = localStorage.getItem('userRole');
  if (userRole !== 'admin') {
    // Esconder elementos de administrador para usuários não administradores
    const adminActions = document.getElementById('adminActions');
    if (adminActions) {
      adminActions.style.display = 'none';
    }
  }

  // Carregar a tabela de usuários
  axios.get('/api/users')
    .then(response => {
      const users = response.data;
      const userTableBody = document.getElementById('userTableBody');
      userTableBody.innerHTML = '';

      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td id="approved-${user.id}">${user.approved ? 'Sim' : 'Não'}</td>
          <td id="blocked-${user.id}">${user.blocked ? 'Sim' : 'Não'}</td>
          <td>
            ${userRole === 'admin' ? `
              <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">Editar</button>
              ${!user.approved ? `<button class="btn btn-sm btn-success" id="approveBtn-${user.id}" onclick="approveUser(${user.id})">Aprovar</button>` : ''}
              ${!user.blocked ? `<button class="btn btn-sm btn-warning" id="blockBtn-${user.id}" onclick="blockUser(${user.id})">Bloquear</button>` : `<button class="btn btn-sm btn-success" id="unblockBtn-${user.id}" onclick="unblockUser(${user.id})">Desbloquear</button>`}
              <button class="btn btn-sm btn-info" onclick="resetUserPassword(${user.id})">Trocar Senha</button>
            ` : ''}
          </td>
        `;
        userTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar usuários:', error);
    });
});

// Função para editar usuário
function editUser(userId) {
  axios.get('/api/users')
    .then(response => {
      const users = response.data;
      const user = users.find(u => u.id === userId);

      if (!user) {
        alert('Usuário não encontrado.');
        return;
      }

      const editFormHtml = `
        <form id="editUserForm">
          <div class="form-group">
            <label for="editUsername">Nome Completo:</label>
            <input type="text" class="form-control" id="editUsername" value="${user.username}" required>
          </div>
          <div class="form-group">
            <label for="editEmail">Email:</label>
            <input type="email" class="form-control" id="editEmail" value="${user.email}" required>
          </div>
          <div class="form-group">
            <label for="editRole">Role:</label>
            <select class="form-control" id="editRole" required>
              <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuário</option>
              <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Salvar</button>
          <button type="button" class="btn btn-secondary" onclick="cancelEdit()">Cancelar</button>
        </form>
      `;

      document.getElementById('editUserContainer').innerHTML = editFormHtml;

      document.getElementById('editUserForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const updatedUser = {
          id: userId,
          username: document.getElementById('editUsername').value,
          email: document.getElementById('editEmail').value,
          role: document.getElementById('editRole').value
        };

        axios.put(`/api/users/${userId}`, updatedUser)
          .then(response => {
            alert('Usuário atualizado com sucesso.');
            location.reload();
          })
          .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar usuário.');
          });
      });
    })
    .catch(error => {
      console.error('Erro ao carregar dados do usuário:', error);
    });
}

// Função para cancelar a edição de usuário
function cancelEdit() {
  document.getElementById('editUserContainer').innerHTML = '';
}

// Função para aprovar usuário
function approveUser(userId) {
  axios.put(`/api/users/${userId}`, { approved: true })
    .then(response => {
      alert('Usuário aprovado com sucesso.');
      document.getElementById(`approveBtn-${userId}`).remove();
      document.getElementById(`approved-${userId}`).innerText = 'Sim';
    })
    .catch(error => {
      console.error('Erro ao aprovar usuário:', error);
      alert('Erro ao aprovar usuário.');
    });
}

// Função para bloquear usuário
function blockUser(userId) {
  axios.put(`/api/users/${userId}`, { blocked: true })
    .then(response => {
      alert('Acesso do usuário bloqueado com sucesso.');
      location.reload();
    })
    .catch(error => {
      console.error('Erro ao bloquear acesso do usuário:', error);
      alert('Erro ao bloquear acesso do usuário.');
    });
}

// Função para desbloquear usuário
function unblockUser(userId) {
  axios.put(`/api/users/${userId}`, { blocked: false })
    .then(response => {
      alert('Acesso do usuário desbloqueado com sucesso.');
      location.reload();
    })
    .catch(error => {
      console.error('Erro ao desbloquear acesso do usuário:', error);
      alert('Erro ao desbloquear acesso do usuário.');
    });
}

// Função para resetar a senha do usuário
function resetUserPassword(userId) {
  const newPassword = prompt("Digite a nova senha:");
  if (!newPassword) {
    alert("Senha não pode ser vazia.");
    return;
  }

  axios.put(`/api/users/${userId}`, { password: newPassword })
    .then(response => {
      alert('Senha do usuário alterada com sucesso.');
    })
    .catch(error => {
      console.error('Erro ao alterar a senha do usuário:', error);
      alert('Erro ao alterar a senha do usuário.');
    });
}

