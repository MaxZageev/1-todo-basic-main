import axios from 'axios';
import type { Filter, Todo } from '../types/todo';
import type { PaginatedTodos, PaginatedTodosResponse, ServerTodo } from '../types/api';

const API_URL = 'http://localhost:3001';

// Создаём единый экземпляр axios с базовым URL и JSON-заголовком, чтобы не дублировать настройки в каждом запросе
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Преобразуем todo из формата сервера в формат клиента (id -> string, createdAt -> Date)
const mapTodoFromServer = (todo: ServerTodo): Todo => ({
  id: todo.id.toString(),
  text: todo.text,
  completed: todo.completed,
  createdAt: new Date(todo.createdAt),
});

// Унифицируем пагинированный ответ: конвертируем каждую задачу в клиентский тип
const mapPaginatedResponse = (payload: PaginatedTodosResponse): PaginatedTodos => ({
  ...payload,
  data: payload.data.map(mapTodoFromServer),
});

// Загружаем страницу задач с бэкенда с учётом пагинации и фильтра
export const fetchTodos = async (page: number, limit: number, filter: Filter): Promise<PaginatedTodos> => {
  const { data } = await api.get<PaginatedTodosResponse>('/todos', {
    params: { page, limit, filter },
  });
  return mapPaginatedResponse(data);
};

// Создаём новую задачу: сервер генерирует id и метку времени, возвращаем преобразованный Todo
export const createTodo = async (text: string): Promise<Todo> => {
  const { data } = await api.post<ServerTodo>('/todos', { text });
  return mapTodoFromServer(data);
};

// Обновляем текст или флаг completed по идентификатору задачи
export const updateTodo = async (
  id: string,
  payload: Partial<Pick<Todo, 'text' | 'completed'>>,
): Promise<Todo> => {
  const { data } = await api.put<ServerTodo>(`/todos/${id}`, payload);
  return mapTodoFromServer(data);
};

// Удаляем задачу на сервере; тело ответа не требуется
export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/todos/${id}`);
};

// Переключаем completed и возвращаем обновлённую задачу
export const toggleTodo = async (id: string): Promise<Todo> => {
  const { data } = await api.patch<ServerTodo>(`/todos/${id}/toggle`);
  return mapTodoFromServer(data);
};
