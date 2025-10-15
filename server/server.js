const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = "0.0.0.0";
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key-here";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret";

const USERS_FILE = path.join(__dirname, "users.json");
const TODOS_FILE = path.join(__dirname, "todos.json");
const REFRESH_TOKENS_FILE = path.join(__dirname, "refresh-tokens.json");

[USERS_FILE, TODOS_FILE, REFRESH_TOKENS_FILE].forEach((file) => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, "[]");
});

app.use(cors());
app.use(express.json());

const readData = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return [];
  }
};

const writeData = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const tokens = generateTokens(user);

  const refreshTokens = readData(REFRESH_TOKENS_FILE);
  refreshTokens.push({ token: tokens.refreshToken, userId: user.id });
  writeData(REFRESH_TOKENS_FILE, refreshTokens);

  res.json(tokens);
});

app.post("/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ error: "Refresh token required" });

  const refreshTokens = readData(REFRESH_TOKENS_FILE);
  const storedToken = refreshTokens.find((t) => t.token === refreshToken);
  if (!storedToken)
    return res.status(403).json({ error: "Invalid refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const users = readData(USERS_FILE);
    const user = users.find((u) => u.id === decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    writeData(
      REFRESH_TOKENS_FILE,
      refreshTokens.filter((t) => t.token !== refreshToken)
    );

    const tokens = generateTokens(user);

    const updatedRefreshTokens = readData(REFRESH_TOKENS_FILE);
    updatedRefreshTokens.push({ token: tokens.refreshToken, userId: user.id });
    writeData(REFRESH_TOKENS_FILE, updatedRefreshTokens);

    res.json(tokens);
  } catch (err) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
});

app.post("/auth/register", async (req, res) => {
  const { email, password, age } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const users = readData(USERS_FILE);
  if (users.some((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now(),
    email,
    password: hashedPassword,
    age: age || null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeData(USERS_FILE, users);

  const tokens = generateTokens(newUser);

  const refreshTokens = readData(REFRESH_TOKENS_FILE);
  refreshTokens.push({ token: tokens.refreshToken, userId: newUser.id });
  writeData(REFRESH_TOKENS_FILE, refreshTokens);

  res.json(tokens);
});

app.get("/auth/me", authenticate, (req, res) => {
  const users = readData(USERS_FILE);
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  const { password, ...userData } = user;
  res.json({
    ...userData,
    age: user.age || null,
  });
});

app.post("/auth/change-password", authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Both passwords are required" });
  }

  const users = readData(USERS_FILE);
  const userIndex = users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  const user = users[userIndex];

  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(401).json({ error: "Invalid old password" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  users[userIndex].password = hashedPassword;
  writeData(USERS_FILE, users);

  let refreshTokens = readData(REFRESH_TOKENS_FILE);
  refreshTokens = refreshTokens.filter((t) => t.userId !== user.id);
  writeData(REFRESH_TOKENS_FILE, refreshTokens);

  res.json({ success: true, message: "Password changed successfully" });
});

app.use("/todos", authenticate);

app.get("/todos", (req, res) => {
  const { page = 1, limit = 10, filter = "all", sort = "newFirst" } = req.query;

  const requestedPage = Math.max(parseInt(page, 10) || 1, 1);
  const requestedLimit = Math.max(parseInt(limit, 10) || 10, 1);

  const userTodos = readData(TODOS_FILE).filter((todo) => todo.userId === req.user.id);

  const filteredTodos = userTodos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  const getCreatedAtTimestamp = (todo) => {
    const ts = new Date(todo.createdAt ?? 0).getTime();
    return Number.isFinite(ts) ? ts : 0;
  };

  const normalizedSort =
    typeof sort === "string" ? sort.toLowerCase() : "newfirst";
  const sortAscending = normalizedSort === "oldfirst";

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const aValue = getCreatedAtTimestamp(a);
    const bValue = getCreatedAtTimestamp(b);

    if (sortAscending) {
      return aValue - bValue;
    }

    return bValue - aValue;
  });

  const total = sortedTodos.length;
  const totalPages = Math.max(1, Math.ceil(total / requestedLimit));
  const pageNumber = Math.min(requestedPage, totalPages);

  const startIndex = (pageNumber - 1) * requestedLimit;
  const endIndex = startIndex + requestedLimit;
  const paginatedTodos = sortedTodos.slice(startIndex, endIndex);

  res.json({
    data: paginatedTodos,
    total,
    page: pageNumber,
    limit: requestedLimit,
    totalPages
  });
});

app.post("/todos", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const todos = readData(TODOS_FILE);
  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    userId: req.user.id,
  };

  todos.unshift(newTodo);
  writeData(TODOS_FILE, todos);

  res.status(201).json(newTodo);
});

app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const todos = readData(TODOS_FILE);
  const todoIndex = todos.findIndex(
    (t) => t.id === parseInt(id, 10) && t.userId === req.user.id
  );

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (text !== undefined) todos[todoIndex].text = text;
  if (completed !== undefined) todos[todoIndex].completed = completed;

  writeData(TODOS_FILE, todos);
  res.json(todos[todoIndex]);
});

app.delete("/todos/:id", (req, res) => {
  const { id } = req.params;

  const todos = readData(TODOS_FILE);
  const todoIndex = todos.findIndex(
    (t) => t.id === parseInt(id, 10) && t.userId === req.user.id
  );

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const deletedTodo = todos.splice(todoIndex, 1);
  writeData(TODOS_FILE, todos);

  res.json(deletedTodo[0]);
});

app.patch("/todos/:id/toggle", (req, res) => {
  const { id } = req.params;

  const todos = readData(TODOS_FILE);
  const todoIndex = todos.findIndex(
    (t) => t.id === parseInt(id, 10) && t.userId === req.user.id
  );

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos[todoIndex].completed = !todos[todoIndex].completed;
  writeData(TODOS_FILE, todos);

  res.json(todos[todoIndex]);
});

app.listen(PORT, HOST, () => {
  console.log(`Auth API server running on http://${HOST}:${PORT}`);
});
