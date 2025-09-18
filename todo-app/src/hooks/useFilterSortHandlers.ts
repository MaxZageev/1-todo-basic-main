import type { SelectChangeEvent } from '@mui/material';
import type { Filter, SortOrder } from '../types/todo';

/**
 * useFilterSortHandlers: отдаёт готовые обработчики для панели фильтра/сортировки.
 * Избавляет компоненты от повторяющегося кода приведения типов и переключения порядка.
 */
export function useFilterSortHandlers(
  onChangeFilter: (f: Filter) => void,
  sort: SortOrder,
  onChangeSort: (s: SortOrder) => void,
) {
  // Приводим значение Select к типу Filter
  const handleFilter = (e: SelectChangeEvent) => onChangeFilter(e.target.value as Filter);
  // Меняем порядок сортировки в одно нажатие
  const toggleSort = () => onChangeSort(sort === 'newFirst' ? 'oldFirst' : 'newFirst');

  return { handleFilter, toggleSort };
}
