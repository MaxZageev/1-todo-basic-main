/**
 * Главный компонент приложения Todo.
 * Здесь собирается всё дерево интерфейса: добавление задач, фильтрация, список, пагинация и обработка ошибок.
 * Вся бизнес-логика работы с задачами реализована через хук useTodos.
 * Оформление и тема управляются через AppThemeProvider.
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
  // Глобальное свойство для хранения корня React (используется для повторного рендера)
  interface Window {
    __APP_ROOT__?: Root;
  }
}

// Функция для инициализации корня React (монтирует приложение в #root)
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
  // Хук useTodos возвращает все данные и методы для работы со списком задач
  const {
    todos,         // Массив задач для текущей страницы
    filter,        // Активный фильтр (все/выполненные/активные)
    sort,          // Порядок сортировки (новые/старые)
    page,          // Текущая страница
    limit,         // Количество задач на странице
    total,         // Всего задач после фильтрации
    totalPages,    // Всего страниц
    setFilter,     // Смена фильтра
    setSort,       // Смена порядка сортировки
    setPage,       // Смена страницы
    setLimit,      // Смена лимита задач на странице
    addTodo,       // Добавить новую задачу
    toggleTodo,    // Переключить статус задачи
    removeTodo,    // Удалить задачу
    editTodo,      // Редактировать задачу
    isLoading,     // Флаг загрузки данных
    error,         // Сообщение об ошибке
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
        {/* Заголовок приложения */}
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Todo App
        </Typography>

        {/* Индикатор загрузки задач с сервера */}
        {isLoading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

        <Stack spacing={2} sx={{ flexShrink: 0 }}>
          {/* Форма добавления новой задачи */}
          <AddTodo onAdd={addTodo} />
          {/* Панель фильтрации, сортировки и переключения темы */}
          <FilterSort
            filter={filter}
            sort={sort}
            onChangeFilter={setFilter}
            onChangeSort={setSort}
          />
          <Divider />
        </Stack>

        {/* Вывод ошибки, если что-то пошло не так */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Список задач с возможностью редактирования, удаления и переключения статуса */}
        <Box sx={{ flex: 1, overflowY: "auto", mt: 2 }}>
          <TodoList
            items={todos}
            onToggle={toggleTodo}
            onDelete={removeTodo}
            onEdit={editTodo}
          />
        </Box>

        {/* Панель пагинации: выбор страницы и количества задач на странице */}
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

// Монтируем приложение в #root с поддержкой темы оформления
ensureRoot().render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>
);

export default App;
