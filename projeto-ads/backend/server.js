const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configurar para servir arquivos estáticos do diretório frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/users', userRoutes);

// Configurar uma rota para servir a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
