document.addEventListener('DOMContentLoaded', function() {
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
          <td>${user.approved ? 'Sim' : 'Não'}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Excluir</button>
            ${!user.approved ? `<button class="btn btn-sm btn-success" onclick="approveUser(${user.id})">Aprovar</button>` : ''}
          </td>
        `;
        userTableBody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro ao carregar usuários:', error);
    });
});

function approveUser(userId) {
  axios.put(`/api/users/${userId}`, { approved: true })
    .then(response => {
      alert('Usuário aprovado com sucesso.');
      location.reload();
    })
    .catch(error => {
      console.error('Erro ao aprovar usuário:', error);
      alert('Erro ao aprovar usuário.');
    });
}

function editUser(userId) {
  // Lógica para editar usuário
  alert('Função de edição ainda não implementada.');
}

function deleteUser(userId) {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    axios.delete(`/api/users/${userId}`)
      .then(response => {
        alert('Usuário excluído com sucesso.');
        location.reload();
      })
      .catch(error => {
        console.error('Erro ao excluir usuário:', error);
        alert('Erro ao excluir usuário.');
      });
  }
}

function logout() {
  // Limpar dados de sessão (se houver)
  localStorage.clear();
  // Redirecionar para a página de login
  window.location.href = 'login.html';
}
