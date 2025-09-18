import type { Todo, Filter, SortOrder } from './todo';

/**
 * Пропсы для переключателя темы: упрощённый интерфейс поверх кастомного Switch.
 */
export interface ThemeSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Пропсы панели фильтра/сортировки: текущие значения и события изменения.
 */
export interface FilterSortProps {
  filter: Filter;
  sort: SortOrder;
  onChangeFilter: (f: Filter) => void;
  onChangeSort: (s: SortOrder) => void;
}

/**
 * Пропсы отдельного элемента списка задач.
 */
export interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
}

/**
 * Пропсы формы добавления задачи: достаточно колбэка onAdd.
 */
export interface AddTodoProps {
  onAdd: (text: string) => void;
}

/**
 * Пропсы списка задач: готовые данные плюс обработчики для элементов.
 */
export interface TodoListProps {
  items: Todo[];
  filter: Filter;
  sort: SortOrder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
}
