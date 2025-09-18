// Типы для описания задачи и параметров фильтрации/сортировки.
// Используются во всех компонентах и хуках приложения.

/**
 * Модель задачи и связанные утилитарные типы для фильтрации и сортировки.
 */
export interface Todo {
  id: string;          // Уникальный идентификатор
  text: string;        // Описание задачи
  completed: boolean;  // Признак завершённости
  createdAt: Date;     // Дата и время создания
}

export type Filter = 'all' | 'completed' | 'active';
export type SortOrder = 'newFirst' | 'oldFirst';
