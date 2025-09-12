import React from "react";
import { Container, Paper, Typography, Stack, Divider, Box } from "@mui/material";
import AddTodo from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";
import FilterSort from "./components/Controls/FilterSort";
import { useTodos } from "./hooks/useTodos";

/**
 * App: Корневой компонент — только композиция UI.
 * Вся бизнес-логика вынесена в хук useTodos.
 */
const App: React.FC = () => {
  // Подключаем бизнес-логику из кастомного хука
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
          {/* Форма добавления задачи (обработчики — из хука useTodos) */}
          <AddTodo onAdd={addTodo} />
          {/* Управление фильтром и сортировкой */}
          <FilterSort filter={filter} sort={sort} onChangeFilter={setFilter} onChangeSort={setSort} />
          <Divider />
        </Stack>

        <Box sx={{ flex: 1, overflowY: "auto", mt: 2 }}>
          {/* Список задач (операции — из хука useTodos) */}
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

export default App;

