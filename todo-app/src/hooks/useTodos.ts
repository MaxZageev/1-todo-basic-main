import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadTodos, saveTodos } from '../utils/localStorage';
import type { Todo, Filter, SortOrder } from '../types/todo';

/**
 * useTodos: Хук бизнес-логики работы со списком задач
 * - хранит и синхронизирует todos в localStorage
 * - управляет фильтром и сортировкой
 * - предоставляет CRUD-операции над задачами
 */
export function useTodos() {
  // Инициализация из localStorage
  const [todos, setTodos] = useState<Todo[]>(() => loadTodos());
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<SortOrder>('newFirst');

  // Сохранение в localStorage при изменении
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Генерация id (используем crypto, если доступен; иначе — fallback)
  const uuid = useCallback(() => {
    const anyGlobal: any = globalThis as any;
    return anyGlobal.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  }, []);

  // CRUD-операции
  const addTodo = useCallback((text: string) => {
    const next: Todo = { id: uuid(), text, completed: false, createdAt: new Date() };
    setTodos(prev => [next, ...prev]);
  }, [uuid]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []);

  const editTodo = useCallback((id: string, nextText: string) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, text: nextText } : t)));
  }, []);

  // Удобный мемо-объект для импорта в компоненты
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

