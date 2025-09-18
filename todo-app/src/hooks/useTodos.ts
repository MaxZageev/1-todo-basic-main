import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadTodos, saveTodos } from '../utils/localStorage';
import type { Todo, Filter, SortOrder } from '../types/todo';

/**
 * useTodos: основной хук работы со списком задач.
 * Держит стейт todos, фильтра и сортировки, синхронизирует данные с localStorage и отдаёт CRUD-операции.
 */
export function useTodos() {
  // Загружаем начальные данные из localStorage (если ничего нет — получим пустой массив)
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortOrder>('newFirst');

  // При любом изменении списка сохраняем его в localStorage
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Функция генерации ID: предпочитаем crypto.randomUUID, иначе используем Math.random fallback
  const uuid = useCallback(() => {
    const anyGlobal: any = globalThis as any;
    return anyGlobal.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  }, []);

  // Создать новую задачу и добавить её в начало списка
  const addTodo = useCallback((text: string) => {
    const next: Todo = { id: uuid(), text, completed: false, createdAt: new Date() };
    setTodos((prev) => [next, ...prev]);
  }, [uuid]);

  // Переключить статус завершённости
  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  // Удалить задачу
  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Отредактировать текст задачи
  const editTodo = useCallback((id: string, nextText: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: nextText } : t)));
  }, []);

  // Собираем все значения в один объект, чтобы удобнее импортировать в компоненты
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
  }), [todos, filter, sort, setFilter, setSort, addTodo, toggleTodo, removeTodo, editTodo]);
}
