import { useMemo } from 'react';
import type { Todo, Filter, SortOrder } from '../types/todo';

/**
 * useFilteredSortedTodos: Вспомогательный хук представления
 * - вычисляет отфильтрованный и отсортированный список задач
 */
export function useFilteredSortedTodos(items: Todo[], filter: Filter, sort: SortOrder) {
  return useMemo(() => {
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

    return sorted;
  }, [items, filter, sort]);
}

