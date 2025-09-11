import React, { useEffect, useId, useState } from "react";
import { Container, Paper, Typography, Stack, Divider, Box } from "@mui/material";
import AddTodo from "./components/AddTodo/AddTodo";
import TodoList from "./components/TodoList/TodoList";
import FilterSort from "./components/Controls/FilterSort";
import { loadTodos, saveTodos } from "./utils/localStorage";
import type { Todo, Filter, SortOrder } from "./types/todo";


function uuid() {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);                                // функция для генерации айдишников ?.() — это optional chaining. 
}

                                                                                                      // создание функционального компонента который вернет нам jsx
const App: React.FC = () => {
  /*const uuid = useId;*/
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());                                      // создаем стейт для хранения и изменения списка задач, начальное значение берем из локального хранилища
  const [filter, setFilter] = useState<Filter>("all");                                                 
  const [sort, setSort] = useState<SortOrder>("newFirst");                                             

  useEffect(() => {                                                                                   // используем хук для сохранения новых задач после каждой отрисоввки 
    saveTodos(todos);
  }, [todos]);

  const addTodo = (text: string) => {                                                                 // функция создающая новый задачу и 
    const next: Todo = { id: uuid(), text, completed: false, createdAt: new Date() };
    setTodos((prev) => [next, ...prev]);                                                              // обновляем состояние и добавляем задачу в начало масива
  };

  const toggle = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));       // ищем обьект по id и создаем новый масив и измененным пераметром
  };

  const remove = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));                                              // создаем массив без указанной задачи
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
          Todo App 
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
