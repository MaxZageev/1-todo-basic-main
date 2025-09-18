// Главный хук для работы со всеми задачами приложения.
// Управляет загрузкой, фильтрацией, сортировкой, пагинацией и CRUD-операциями.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadTodos, saveTodos } from '../utils/localStorage';
import type { Todo, Filter, SortOrder } from '../types/todo';
import {
  fetchTodos as fetchTodosApi,
  createTodo as createTodoApi,
  updateTodo as updateTodoApi,
  deleteTodo as deleteTodoApi,
  toggleTodo as toggleTodoApi,
} from '../api/todos';

/**
 * useTodos: базовый хук для работы со всеми задачами.
 * Достаём данные из localStorage для мгновенного отображения и синхронизируемся с сервером.
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const API_FETCH_LIMIT = 1000; // Максимум объектов, которые запрашиваем с сервера за раз

export function useTodos() {
  // Состояния: все задачи, фильтр, сортировка, страница, лимит, загрузка, ошибка
  const [allTodos, setAllTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilterState] = useState<Filter>('all');
  const [sort, setSortState] = useState<SortOrder>('newFirst');
  const [page, setPageState] = useState<number>(DEFAULT_PAGE);
  const [limit, setLimitState] = useState<number>(DEFAULT_LIMIT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0); // Инкрементируем, чтобы принудительно обновить данные

  useEffect(() => {
    // Сохраняем задачи в localStorage при каждом изменении
    saveTodos(allTodos);
  }, [allTodos]);

  // Обработчик ошибок: сохраняет текст ошибки для отображения
  const handleError = useCallback((err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      setError(err.message);
    } else {
      setError(fallback);
    }
  }, []);

  // Загрузка задач с сервера
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await fetchTodosApi(DEFAULT_PAGE, API_FETCH_LIMIT, 'all');
      setAllTodos(data);
    } catch (err) {
      handleError(err, 'Не удалось загрузить список задач');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    // Загружаем задачи при инициализации и обновлении refreshToken
    void fetchData();
  }, [fetchData, refreshToken]);

  // Функция для принудительного обновления данных
  const triggerRefresh = useCallback(() => {
    setRefreshToken((prev) => prev + 1);
  }, []);

  // Обработчики смены фильтра, сортировки, лимита, страницы
  const setFilter = useCallback((next: Filter) => {
    setFilterState(next);
    setPageState(DEFAULT_PAGE);
  }, []);

  const setSort = useCallback((next: SortOrder) => {
    setSortState(next);
    setPageState(DEFAULT_PAGE);
  }, []);

  const setLimit = useCallback((nextLimit: number) => {
    setLimitState(nextLimit);
    setPageState(DEFAULT_PAGE);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(nextPage, 1));
  }, []);

  // Сначала фильтруем весь массив задач, а затем сортируем его, чтобы порядок применялся ко всему списку,
  // независимо от выбранной страницы. Уже после этого массив режется на «страницы».
  const processedTodos = useMemo(() => {
    const filtered = allTodos.filter((todo) => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'active') return !todo.completed;
      return true;
    });

    const sortedList = [...filtered].sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return sort === 'newFirst' ? bTime - aTime : aTime - bTime;
    });

    return sortedList;
  }, [allTodos, filter, sort]);

  // Пагинация: вычисляем текущую страницу и количество задач
  const totalFiltered = processedTodos.length;
  const totalPages = Math.max(Math.ceil(totalFiltered / limit), 1);
  const currentPage = Math.min(Math.max(page, DEFAULT_PAGE), totalPages);

  useEffect(() => {
    // Корректируем страницу, если она вышла за пределы
    if (page !== currentPage) {
      setPageState(currentPage);
    }
  }, [page, currentPage]);

  // Нарезаем задачи на страницы
  const paginatedTodos = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return processedTodos.slice(start, start + limit);
  }, [processedTodos, currentPage, limit]);

  // CRUD-операции: добавление, переключение, удаление, редактирование задачи
  const addTodo = useCallback((text: string) => {
    setError(null);
    createTodoApi(text)
      .then((created) => {
        setAllTodos((prev) => [created, ...prev]);
        setPageState(DEFAULT_PAGE);
      })
      .catch((err) => handleError(err, 'Не удалось создать задачу'));
  }, [handleError]);

  const toggleTodo = useCallback((id: string) => {
    setError(null);
    toggleTodoApi(id)
      .then((updated) => {
        setAllTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      })
      .catch((err) => handleError(err, 'Не удалось переключить задачу'));
  }, [handleError]);

  const removeTodo = useCallback((id: string) => {
    setError(null);
    deleteTodoApi(id)
      .then(() => {
        setAllTodos((prev) => prev.filter((t) => t.id !== id));
      })
      .catch((err) => handleError(err, 'Не удалось удалить задачу'));
  }, [handleError]);

  const editTodo = useCallback((id: string, nextText: string) => {
    setError(null);
    updateTodoApi(id, { text: nextText })
      .then((updated) => {
        setAllTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      })
      .catch((err) => handleError(err, 'Не удалось обновить задачу'));
  }, [handleError]);

  return useMemo(() => ({
    todos: paginatedTodos,
    filter,
    sort,
    page: currentPage,
    limit,
    total: totalFiltered,
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
    reload: triggerRefresh,
  }), [
    paginatedTodos,
    filter,
    sort,
    currentPage,
    limit,
    totalFiltered,
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
    triggerRefresh,
  ]);
}
