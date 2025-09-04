import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Stack, Divider, Box } from "@mui/material";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import FilterSort from "./components/Controls/FilterSort";
import type { Todo, Filter, SortOrder } from "./types/todo";
import { loadTodos, saveTodos } from "./utils/localStorage";

function uuid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortOrder>("newFirst");

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = (text: string) => {
    const next: Todo = { id: uuid(), text, completed: false, createdAt: new Date() };
    setTodos((prev) => [next, ...prev]);
  };

  const toggle = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const remove = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const edit = (id: string, nextText: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: nextText } : t)));
  };

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
          Todo App Lite
        </Typography>

        <Stack spacing={2} sx={{ flexShrink: 0 }}>
          <AddTodo onAdd={addTodo} />
          <FilterSort filter={filter} sort={sort} onChangeFilter={setFilter} onChangeSort={setSort} />
          <Divider />
        </Stack>

        <Box sx={{ flex: 1, overflowY: "auto", mt: 2, }}>
          <TodoList items={todos} filter={filter} sort={sort} onToggle={toggle} onDelete={remove} onEdit={edit} />
        </Box>
      </Paper>
    </Container>
  );
};

export default App;
