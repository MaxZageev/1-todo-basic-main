import type { Todo, Filter, SortOrder } from './todo';

export interface ThemeSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export interface FilterSortProps {
  filter: Filter;
  sort: SortOrder;
  onChangeFilter: (f: Filter) => void;
  onChangeSort: (s: SortOrder) => void;
}

export interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
}

export interface AddTodoProps {
  onAdd: (text: string) => void;
}

export interface TodoListProps {
  items: Todo[];
  filter: Filter;
  sort: SortOrder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
}
