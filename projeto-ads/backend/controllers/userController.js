const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/users.json');

const getUsers = (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler arquivo de dados.');
      return;
    }
    res.send(JSON.parse(data));
  });
};

const createUser = (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler arquivo de dados.');
      return;
    }
    const users = JSON.parse(data);
    const newUser = req.body;
    newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
    newUser.approved = false;  // Novo usuário não aprovado por padrão
    newUser.blocked = false;   // Novo usuário não bloqueado por padrão
    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send('Erro ao escrever no arquivo de dados.');
        return;
      }
      res.status(201).send(newUser);
    });
  });
};

const updateUser = (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler arquivo de dados.');
      return;
    }
    const users = JSON.parse(data);
    const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    if (userIndex === -1) {
      res.status(404).send('Usuário não encontrado.');
      return;
    }
    users[userIndex] = { ...users[userIndex], ...req.body };
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send('Erro ao escrever no arquivo de dados.');
        return;
      }
      res.send(users[userIndex]);
    });
  });
};

const deleteUser = (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler arquivo de dados.');
      return;
    }
    let users = JSON.parse(data);
    users = users.filter(user => user.id !== parseInt(req.params.id));
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send('Erro ao escrever no arquivo de dados.');
        return;
      }
      res.status(204).send();
    });
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler arquivo de dados.');
      return;
    }
    const users = JSON.parse(data);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      res.status(401).send('Credenciais inválidas.');
      return;
    }
    if (!user.approved) {
      res.status(403).send('Usuário não aprovado.');
      return;
    }
    if (user.blocked) {
      res.status(403).send('Usuário bloqueado.');
      return;
    }
    res.send({ message: 'Login bem-sucedido', user });
  });
};

const resetPassword = (req, res) => {
  const { username, newPassword } = req.body;
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler arquivo de dados.');
      return;
    }
    const users = JSON.parse(data);
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      res.status(404).send('Usuário não encontrado.');
      return;
    }
    users[userIndex].password = newPassword;
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send('Erro ao escrever no arquivo de dados.');
        return;
      }
      res.send({ message: 'Senha atualizada com sucesso' });
    });
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  resetPassword
};
