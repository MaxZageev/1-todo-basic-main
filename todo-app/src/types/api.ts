// Типы для работы с серверным API задач.
// Описывают структуру данных, приходящих с сервера и используемых на клиенте.
import type { Todo } from './todo';

/**
 * ServerTodo: сырые данные от API. Сервер хранит id как number и createdAt как ISO-строку.
 */
export interface ServerTodo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

/**
 * PaginatedTodosResponse: структура ответа /todos на бэкенде (до преобразования на клиенте).
 */
export interface PaginatedTodosResponse {
  data: ServerTodo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * PaginatedTodos: та же страница задач, но уже в типах фронтенда (createdAt -> Date, id -> string).
 */
export interface PaginatedTodos {
  data: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
