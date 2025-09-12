import React from 'react';
import { List, Typography } from '@mui/material';
import TodoItem from '../TodoItem/TodoItem';
import type { TodoListProps } from '../../types/components';

const TodoList: React.FC<TodoListProps> = ({ items, filter, sort, onToggle, onDelete, onEdit }) => {
  const filtered = items.filter(t => {
    if (filter === 'completed') return t.completed;
    if (filter === 'active') return !t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aTime = a.createdAt.getTime();
    const bTime = b.createdAt.getTime();
    return sort === 'newFirst' ? bTime - aTime : aTime - bTime;
  });

  if (!sorted.length) {
    return <Typography sx={{ opacity: 0.7, mt: 2 }}>Пока пусто. Добавь первую задачу — и мир станет лучше</Typography>;
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
