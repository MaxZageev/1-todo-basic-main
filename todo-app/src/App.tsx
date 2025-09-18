/**
 * Точка входа клиента: монтируем дерево React в #root.
 */
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { Container, Paper, Typography, Stack, Divider, Box, LinearProgress, Alert } from "@mui/material";
import AddTodo from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";
import FilterSort from "./components/Controls/FilterSort";
import PaginationControls from "./components/PaginationControls/PaginationControls";
import { AppThemeProvider } from "./theme/ThemeProvider";
import { useTodos } from "./hooks/useTodos";

declare global {
  interface Window {
    __APP_ROOT__?: Root;
  }
}

const ensureRoot = (): Root => {
  if (window.__APP_ROOT__) {
    return window.__APP_ROOT__;
  }

  const container = document.getElementById("root");

  if (!container) {
    throw new Error("Элемент с id #root не найден");
  }

  window.__APP_ROOT__ = createRoot(container);
  return window.__APP_ROOT__;
};

const LIMIT_OPTIONS = [5, 10, 20];

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
            onChangeFilter={setFilter}
            onChangeSort={setSort}
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
            onToggle={toggleTodo}
            onDelete={removeTodo}
            onEdit={editTodo}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <PaginationControls
            page={page}
            total={total}
            totalPages={totalPages}
            limit={limit}
            limitOptions={LIMIT_OPTIONS}
            onChangePage={setPage}
            onChangeLimit={setLimit}
          />
        </Box>
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
