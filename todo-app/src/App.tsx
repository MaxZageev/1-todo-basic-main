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

        <Stack spacing={2} sx={{ flexShrink: 0 }}>
          <AddTodo onAdd={addTodo} />
          <FilterSort filter={filter} sort={sort} onChangeFilter={setFilter} onChangeSort={setSort} />
          <Divider />
        </Stack>

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

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find root element");
}

const root = window.__APP_ROOT__ ?? createRoot(rootElement);
window.__APP_ROOT__ = root;

root.render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>
);

export default App;
