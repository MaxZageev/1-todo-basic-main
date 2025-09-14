import type { SelectChangeEvent } from '@mui/material';
import type { Filter, SortOrder } from '../types/todo';

/**
 * useFilterSortHandlers: Хук-обёртка для обработчиков фильтра и сортировки
 */
export function useFilterSortHandlers(
  onChangeFilter: (f: Filter) => void,
  sort: SortOrder,
  onChangeSort: (s: SortOrder) => void,
) {
  const handleFilter = (e: SelectChangeEvent) => onChangeFilter(e.target.value as Filter);
  const toggleSort = () => onChangeSort(sort === 'newFirst' ? 'oldFirst' : 'newFirst');

  return { handleFilter, toggleSort };
}
