import { useMemo } from 'react';
import type { Todo, Filter, SortOrder } from '../types/todo';

/**
 * useFilteredSortedTodos: возвращает массив задач по текущему фильтру и порядку сортировки.
 * Упаковывает вычисления в useMemo, чтобы не пересчитывать список без необходимости.
 */

// Хук для фильтрации и сортировки массива задач.
// Используется для получения отсортированного списка по выбранным параметрам.
export function useFilteredSortedTodos(items: Todo[], filter: Filter, sort: SortOrder) {
  return useMemo(() => {
    // Сначала отбираем задачи по выбранному статусу
    const filtered = items.filter((t) => {
      if (filter === 'completed') return t.completed;
      if (filter === 'active') return !t.completed;
      return true;
    });

    // Затем создаём новый массив и сортируем по дате создания
    const sorted = [...filtered].sort((a, b) => {
      const aTime = a.createdAt.getTime();
      const bTime = b.createdAt.getTime();
      return sort === 'newFirst' ? bTime - aTime : aTime - bTime;
    });

    return sorted;
  }, [items, filter, sort]);
}
