import React from 'react';
import { List, Typography } from '@mui/material';
import TodoItem from '../TodoItem/TodoItem';
import type { TodoListProps } from '../../types/components';

/**
 * TodoList: выводит задачи, полученные уже в нужном порядке.
 */
const TodoList: React.FC<TodoListProps> = ({ items, onToggle, onDelete, onEdit }) => {
  if (!items.length) {
    return <Typography sx={{ opacity: 0.7, mt: 2 }}>Задач нет. Добавьте новую.</Typography>;
  }

  return (
    <List sx={{ mt: 1 }}>
      {items.map((t) => (
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
