/**
 * Точка входа приложения: инициализация дерева React.
 * Vite монтирует её в корневой элемент (т.е. index.html).
 */
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { Container, Paper, Typography, Stack, Divider, Box, LinearProgress, Pagination, Alert } from "@mui/material";
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
 * Проверяем (или создаём) корневой контейнер React.
 * Нужно для корректной работы HMR и повторного рендера.
 */
const ensureRoot = (): Root => {
  if (window.__APP_ROOT__) {
    return window.__APP_ROOT__;
  }

  const container = document.getElementById("root");

  if (!container) {
    throw new Error("Контейнер элемента #root не найден в документе");
  }

  window.__APP_ROOT__ = createRoot(container);
  return window.__APP_ROOT__;
};

const App: React.FC = () => {
  const {
    todos,
    filter,
    sort,
    page,
    limit,
    total,
    totalPages,
    setFilter,
    setSort,
    setPage,
    setLimit,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
    isLoading,
    error,
  } = useTodos();

  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(page, safeTotalPages);

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

        {isLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Stack spacing={2} sx={{ flexShrink: 0 }}>
          <AddTodo onAdd={addTodo} />
          <FilterSort
            filter={filter}
            sort={sort}
            limit={limit}
            onChangeFilter={setFilter}
            onChangeSort={setSort}
            onChangeLimit={setLimit}
          />
          <Divider />
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

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

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent={{ xs: "center", sm: "space-between" }}
          sx={{ mt: 2 }}
        >
          <Pagination
            count={safeTotalPages}
            page={safePage}
            onChange={(_, value) => setPage(value)}
            color="primary"
            showFirstButton
            showLastButton
            disabled={totalPages <= 1}
          />
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Страница {safePage} из {safeTotalPages} • Всего задач: {total}
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

ensureRoot().render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>
);

export default App;
