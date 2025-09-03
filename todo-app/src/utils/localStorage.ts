import type { Todo } from '../types/todo';

const TODOS_KEY = 'todos';
const THEME_KEY = 'theme'; // 'light' | 'dark'

export function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Omit<Todo, 'createdAt'> & { createdAt: string }>;
    return parsed.map(t => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  const toStore = todos.map(t => ({ ...t, createdAt: t.createdAt.toISOString() }));
  localStorage.setItem(TODOS_KEY, JSON.stringify(toStore));
}

export function loadTheme(): 'light' | 'dark' {
  const raw = localStorage.getItem(THEME_KEY);
  return raw === 'dark' ? 'dark' : 'light';
}

export function saveTheme(mode: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, mode);
}
