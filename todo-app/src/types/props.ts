import type { Filter, SortOrder, Todo } from "./todo";

export interface Props {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  items: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
  onAdd: (text: string) => void;
  filter: Filter;
  sort: SortOrder;
  onChangeFilter: (f: Filter) => void;
  onChangeSort: (s: SortOrder) => void;
  checked: boolean;
  onChange: (checked: boolean) => void;
};
