import React from 'react';
import { List, Typography } from '@mui/material';
import TodoItem from '../TodoItem/TodoItem';
import type { TodoListProps } from '../../types/components';
import { useFilteredSortedTodos } from '../../hooks/useFilteredSortedTodos';

/**
 * TodoList: Презентационный компонент списка
 * - Фильтрация/сортировка вынесены в useFilteredSortedTodos
 */
const TodoList: React.FC<TodoListProps> = ({ items, filter, sort, onToggle, onDelete, onEdit }) => {
  const sorted = useFilteredSortedTodos(items, filter, sort);

  if (!sorted.length) {
    return <Typography sx={{ opacity: 0.7, mt: 2 }}>Задач нет. Добавьте первую выше.</Typography>;
  }

  return (
    <List sx={{ mt: 1 }}>
      {sorted.map(t => (
        <TodoItem
          key={t.id}
          id={t.id}
          text={t.text}
          completed={t.completed}
          createdAt={t.createdAt}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </List>
  );
};

export default TodoList;

