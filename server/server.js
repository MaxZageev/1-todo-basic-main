const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;   // теперь можно переопределять порт из переменной окружения
const HOST = '0.0.0.0';                  // слушаем все интерфейсы (не только localhost)
const DB_FILE = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());

// Создадим файл хранения, если он отсутствует
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

const readTodos = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
};

const writeTodos = (todos) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(todos, null, 2));
};

// ======================= API =======================

app.get('/todos', (req, res) => {
  const { page = 1, limit = 10, filter = 'all' } = req.query;
  let todos = readTodos();

  switch (filter) {
    case 'completed':
      todos = todos.filter(t => t.completed);
      break;
    case 'active':
      todos = todos.filter(t => !t.completed);
      break;
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedTodos = todos.slice(startIndex, endIndex);

  res.json({
    data: paginatedTodos,
    total: todos.length,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(todos.length / limit),
  });
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  const todos = readTodos();
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.unshift(newTodo);
  writeTodos(todos);

  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const todos = readTodos();
  const todoIndex = todos.findIndex(t => t.id === parseInt(id));

  if (todoIndex === -1) return res.status(404).json({ error: 'Todo not found' });

  if (text !== undefined) todos[todoIndex].text = text;
  if (completed !== undefined) todos[todoIndex].completed = completed;

  writeTodos(todos);
  res.json(todos[todoIndex]);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const filtered = todos.filter(t => t.id !== parseInt(id));

  if (filtered.length === todos.length) return res.status(404).json({ error: 'Todo not found' });

  writeTodos(filtered);
  res.status(204).send();
});

app.patch('/todos/:id/toggle', (req, res) => {
  const { id } = req.params;
  const todos = readTodos();
  const todoIndex = todos.findIndex(t => t.id === parseInt(id));

  if (todoIndex === -1) return res.status(404).json({ error: 'Todo not found' });

  todos[todoIndex].completed = !todos[todoIndex].completed;
  writeTodos(todos);

  res.json(todos[todoIndex]);
});

// ======================= START =======================
app.listen(PORT, HOST, () => {
  console.log(`🚀 Todo API server running on http://${HOST}:${PORT}`);
  console.log(`
  API endpoints:
  GET    /todos?page=1&limit=10&filter=all|active|completed
  POST   /todos             { text }
  PUT    /todos/:id         { text?, completed? }
  DELETE /todos/:id
  PATCH  /todos/:id/toggle
  `);
});
