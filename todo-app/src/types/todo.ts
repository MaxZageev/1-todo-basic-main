export interface Todo {
  id: string;          // айдишник
  text: string;        // текст самой задачи
  completed: boolean;  // состояние задачи
  createdAt: Date;     // дата создания
}

export type Filter = 'all' | 'completed' | 'active';
export type SortOrder = 'newFirst' | 'oldFirst';
