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
 * useTodos: базовый хук для всей работы со списком.
 * Совмещает локальный кэш (localStorage) и запросы к серверу с учётом пагинации.
 */
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilterState] = useState<Filter>('all');
  const [sort, setSort] = useState<SortOrder>('newFirst');
  const [page, setPageState] = useState<number>(DEFAULT_PAGE);
  const [limit, setLimitState] = useState<number>(DEFAULT_LIMIT);
  const [total, setTotal] = useState<number>(todos.length);
  const [totalPages, setTotalPages] = useState<number>(Math.max(Math.ceil(todos.length / DEFAULT_LIMIT), 1));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0); // увеличиваем, когда нужно принудительно обновить данные

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const handleError = useCallback((err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      setError(err.message);
    } else {
      setError(fallback);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, total: serverTotal, totalPages: serverTotalPages, page: serverPage } = await fetchTodosApi(page, limit, filter);

      setTotal(serverTotal);
      setTotalPages(serverTotalPages);

      if (serverTotalPages > 0 && page > serverTotalPages) {
        setPageState(serverTotalPages);
        return;
      }

      if (serverTotalPages === 0) {
        setTodos([]);
        if (page !== DEFAULT_PAGE) {
          setPageState(DEFAULT_PAGE);
        }
        return;
      }

      setTodos(data);
      setPageState(serverPage);
    } catch (err) {
      handleError(err, 'Не удалось загрузить список задач');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, filter, handleError]);

  useEffect(() => {
    void fetchData();
  }, [fetchData, refreshToken]);

  const triggerRefresh = useCallback(() => {
    setRefreshToken((prev) => prev + 1);
  }, []);

  const setFilter = useCallback((next: Filter) => {
    setFilterState(next);
    setPageState(DEFAULT_PAGE);
  }, []);

  const setLimit = useCallback((nextLimit: number) => {
    setLimitState(nextLimit);
    setPageState(DEFAULT_PAGE);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(nextPage);
  }, []);

  const addTodo = useCallback((text: string) => {
    setError(null);
    createTodoApi(text)
      .then((created) => {
        if (page === DEFAULT_PAGE) {
          setTodos((prev) => {
            const next = [created, ...prev];
            return next.length > limit ? next.slice(0, limit) : next;
          });
          triggerRefresh();
        } else {
          setPageState(DEFAULT_PAGE);
        }
      })
      .catch((err) => handleError(err, 'Не удалось создать задачу'));
  }, [handleError, page, limit, triggerRefresh]);

  const toggleTodo = useCallback((id: string) => {
    setError(null);
    toggleTodoApi(id)
      .then((updated) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      })
      .catch((err) => handleError(err, 'Не удалось переключить задачу'));
  }, [handleError]);

  const removeTodo = useCallback((id: string) => {
    setError(null);
    deleteTodoApi(id)
      .then(() => {
        let movedToPrevPage = false;
        setTodos((prev) => {
          const next = prev.filter((t) => t.id !== id);
          if (next.length === 0 && page > DEFAULT_PAGE) {
            movedToPrevPage = true;
            setPageState(page - 1);
          }
          return next;
        });
        if (!movedToPrevPage) {
          triggerRefresh();
        }
      })
      .catch((err) => handleError(err, 'Не удалось удалить задачу'));
  }, [handleError, page, triggerRefresh]);

  const editTodo = useCallback((id: string, nextText: string) => {
    setError(null);
    updateTodoApi(id, { text: nextText })
      .then((updated) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      })
      .catch((err) => handleError(err, 'Не удалось обновить задачу'));
  }, [handleError]);

  return useMemo(() => ({
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
    reload: triggerRefresh,
  }), [
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
    triggerRefresh,
  ]);
}
