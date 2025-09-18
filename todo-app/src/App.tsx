/**
 * Главный модуль приложения: инициализирует темы и выводит интерфейс списка задач.
 * Vite использует этот файл как единственную точку входа (см. index.html).
 */
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { Container, Paper, Typography, Stack, Divider, Box } from "@mui/material";
import AddTodo from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";
import FilterSort from "./components/Controls/FilterSort";
import { AppThemeProvider } from "./theme/ThemeProvider";
import { useTodos } from "./hooks/useTodos";

declare global {
  interface Window {
    __APP_ROOT__?: Root;
  }
}

/**
 * Возвращает (или создаёт) единственный экземпляр React Root.
 * Это позволяет переживать HMR и повторные импорты без повторного монтирования.
 */
const ensureRoot = (): Root => {
  if (window.__APP_ROOT__) {
    return window.__APP_ROOT__;
  }

  const container = document.getElementById("root");

  if (!container) {
    throw new Error("Корневой контейнер #root не найден в документе");
  }

  window.__APP_ROOT__ = createRoot(container);
  return window.__APP_ROOT__;
};

const App: React.FC = () => {
  const { todos, filter, sort, setFilter, setSort, addTodo, toggleTodo, removeTodo, editTodo } = useTodos();

  return (
    <Container maxWidth="sm" sx={{ py: 4, height: "100vh", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text)",
          transition: "all 0.4s ease-in-out",
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Todo App
        </Typography>

        {/* Панель управления: добавление задач, фильтр и сортировка */}
        <Stack spacing={2} sx={{ flexShrink: 0 }}>
          <AddTodo onAdd={addTodo} />
          <FilterSort filter={filter} sort={sort} onChangeFilter={setFilter} onChangeSort={setSort} />
          <Divider />
        </Stack>

        {/* Основная часть: список задач с действиями */}
        <Box sx={{ flex: 1, overflowY: "auto", mt: 2 }}>
          <TodoList
            items={todos}
            filter={filter}
            sort={sort}
            onToggle={toggleTodo}
            onDelete={removeTodo}
            onEdit={editTodo}
          />
        </Box>
      </Paper>
    </Container>
  );
};

// Запускаем приложение под обёрткой темы и строгого режима React.
ensureRoot().render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>
);

export default App;
