import React from 'react';
import { List, Typography } from '@mui/material';
import TodoItem from '../TodoItem/TodoItem';
import type { TodoListProps } from '../../types/components';
import { useFilteredSortedTodos } from '../../hooks/useFilteredSortedTodos';

/**
 * Компонент TodoList: выводит список задач с учётом фильтра и сортировки.
 * Отбирает и упорядочивает элементы через useFilteredSortedTodos, затем рендерит TodoItem.
 */
const TodoList: React.FC<TodoListProps> = ({ items, filter, sort, onToggle, onDelete, onEdit }) => {
  const sorted = useFilteredSortedTodos(items, filter, sort);

  if (!sorted.length) {
    // Ничего не найдено под текущими условиями — выводим дружелюбный плейсхолдер
    return <Typography sx={{ opacity: 0.7, mt: 2 }}>Задач нет. Добавьте первую выше.</Typography>;
  }

  return (
    <List sx={{ mt: 1 }}>
      {sorted.map((t) => (
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
