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
 * useTodos: основной хук для работы с задачами.
 * Теперь совмещаем локальный кэш (localStorage) с серверным API и сохраняем старый интерфейс для компонентов.
 */
const DEFAULT_PAGE = 1; // При первом запросе берём самую свежую страницу
const DEFAULT_LIMIT = 100; // Этого лимита достаточно для типичных сценариев; при необходимости легко увеличить
const DEFAULT_API_FILTER: Filter = 'all'; // На сервер просим все задачи, фильтрация на клиенте осталась прежней

export function useTodos() {
  // Загружаем последнее локальное состояние, чтобы интерфейс не мигал до ответа сервера
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortOrder>('newFirst');
  const [isLoading, setIsLoading] = useState(false); // Флаг первой загрузки с бэкенда
  const [error, setError] = useState<string | null>(null); // Сообщение об ошибке последней операции

  // Любые изменения задач зеркалим в localStorage (быстрый кэш и офлайн-режим)
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Унифицированный обработчик ошибок: приводим сообщение к понятному виду и сохраняем в состоянии
  const handleError = useCallback((err: unknown, fallback: string) => {
    if (err instanceof Error && err.message) {
      setError(err.message);
    } else {
      setError(fallback);
    }
  }, []);

  // Подтягиваем задачи с сервера: очищаем ошибку, показываем индикатор загрузки и нормализуем ответ
  const syncTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await fetchTodosApi(DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_API_FILTER);
      setTodos(data);
    } catch (err) {
      handleError(err, 'Не удалось загрузить список задач');
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // При первом монтировании получаем актуальное состояние с сервера
  useEffect(() => {
    void syncTodos();
  }, [syncTodos]);

  // Добавление задач: отправляем текст на сервер и сразу подмешиваем ответ в начало списка
  const addTodo = useCallback((text: string) => {
    setError(null);
    createTodoApi(text)
      .then((created) => {
        setTodos((prev) => [created, ...prev]);
      })
      .catch((err) => handleError(err, 'Не удалось создать задачу'));
  }, [handleError]);

  // Переключение completed: используем ответ сервера, чтобы не разъехались статусы
  const toggleTodo = useCallback((id: string) => {
    setError(null);
    toggleTodoApi(id)
      .then((updated) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      })
      .catch((err) => handleError(err, 'Не удалось переключить задачу'));
  }, [handleError]);

  // Удаление: после успешного запроса фильтруем локальное состояние
  const removeTodo = useCallback((id: string) => {
    setError(null);
    deleteTodoApi(id)
      .then(() => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      })
      .catch((err) => handleError(err, 'Не удалось удалить задачу'));
  }, [handleError]);

  // Редактирование: обновляем текст или completed и заменяем элемент на вариант с сервера
  const editTodo = useCallback((id: string, nextText: string) => {
    setError(null);
    updateTodoApi(id, { text: nextText })
      .then((updated) => {
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      })
      .catch((err) => handleError(err, 'Не удалось обновить задачу'));
  }, [handleError]);

  // Возвращаем хук в прежнем формате, добавив служебные поля для возможного UI-индикатора
  return useMemo(() => ({
    todos,
    filter,
    sort,
    setFilter,
    setSort,
    addTodo,
    toggleTodo,
    removeTodo,
    editTodo,
    isLoading,
    error,
    reload: syncTodos,
  }), [todos, filter, sort, setFilter, setSort, addTodo, toggleTodo, removeTodo, editTodo, isLoading, error, syncTodos]);
}
