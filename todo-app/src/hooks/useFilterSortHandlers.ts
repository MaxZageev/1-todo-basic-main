import type { SelectChangeEvent } from '@mui/material';
import type { Filter, SortOrder } from '../types/todo';

/**
 * useFilterSortHandlers: Хук-обёртка для обработчиков фильтра и сортировки
 */
export function useFilterSortHandlers(
  onChangeFilter: (f: Filter) => void,
  onChangeSort: (s: SortOrder) => void,
) {
  const handleFilter = (e: SelectChangeEvent) => onChangeFilter(e.target.value as Filter);
  const handleSort = (e: SelectChangeEvent) => onChangeSort(e.target.value as SortOrder);

  return { handleFilter, handleSort };
}

