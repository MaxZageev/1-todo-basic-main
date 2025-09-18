import type { Todo } from '../types/todo';

const TODOS_KEY = 'todos';
const THEME_KEY = 'theme'; // значение хранится как 'light' или 'dark'

/**
 * Загружает задачи из localStorage и приводит дату к объекту Date.
 */
export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Omit<Todo, 'createdAt'> & { createdAt: string }>;
    return parsed.map((t) => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch {
    // При любой ошибке (битый JSON, ограничение доступа) возвращаем пустой список
    return [];
  }
}

/**
 * Сохраняет задачи в localStorage, сериализуя дату в ISO-строку.
 */
export function saveTodos(todos: Todo[]): void {
  const toStore = todos.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() }));
  localStorage.setItem(TODOS_KEY, JSON.stringify(toStore));
}

/**
 * Возвращает сохранённый режим темы или `light` по умолчанию.
 */
export function loadTheme(): 'light' | 'dark' {
  const raw = localStorage.getItem(THEME_KEY);
  return raw === 'dark' ? 'dark' : 'light';
}

/**
 * Сохраняет текущий режим темы.
 */
export function saveTheme(mode: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, mode);
}
