const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Criação da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'exemplo'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL');
  }
});

// Criação do aplicativo Express
const app = express();
app.use(bodyParser.json());

// Rotas CRUD
// Listar todos os itens
app.get('/items', (req, res) => {
  connection.query('SELECT * FROM items', (err, results) => {
    if (err) {
      console.error('Erro ao buscar os itens:', err);
      res.status(500).send('Erro ao buscar os itens.');
    } else {
      res.json(results);
    }
  });
});

// Obter um item pelo ID
app.get('/items/:id', (req, res) => {
  const itemId = req.params.id;
  connection.query('SELECT * FROM items WHERE id = ?', [itemId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar o item:', err);
      res.status(500).send('Erro ao buscar o item.');
    } else if (results.length === 0) {
      res.status(404).send('Item não encontrado.');
    } else {
      res.json(results[0]);
    }
  });
});

// Criar um novo item
app.post('/items', (req, res) => {
  const newItem = req.body;
  connection.query('INSERT INTO items SET ?', newItem, (err, result) => {
    if (err) {
      console.error('Erro ao criar o item:', err);
      res.status(500).send('Erro ao criar o item.');
    } else {
      newItem.id = result.insertId;
      res.json(newItem);
    }
  });
});

// Atualizar um item existente
app.put('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const updatedItem = req.body;
  connection.query('UPDATE items SET ? WHERE id = ?', [updatedItem, itemId], (err) => {
    if (err) {
      console.error('Erro ao atualizar o item:', err);
      res.status(500).send('Erro ao atualizar o item.');
    } else {
      res.json(updatedItem);
    }
  });
});

// Excluir um item
app.delete('/items/:id', (req, res) => {
  const itemId = req.params.id;
  connection.query('DELETE FROM items WHERE id = ?', [itemId], (err) => {
    if (err) {
      console.error('Erro ao excluir o item:', err);
      res.status(500).send('Erro ao excluir o item.');
    } else {
      res.send('Item excluído com sucesso.');
    }
  });
});

// Iniciar o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
