// Хук для генерации обработчиков фильтрации и сортировки.
// Упрощает работу с Select и кнопкой сортировки в панели управления.
import type { SelectChangeEvent } from '@mui/material';
import type { Filter, SortOrder } from '../types/todo';

/**
 * useFilterSortHandlers: отдаёт готовые обработчики для панели фильтра/сортировки.
 * Избавляет компонент от повторяющегося кода приведения типов и переключения порядка.
 */
export function useFilterSortHandlers(
  onChangeFilter: (f: Filter) => void,
  sort: SortOrder,
  onChangeSort: (s: SortOrder) => void,
) {
  // Приводим значение Select к типу Filter
  const handleFilter = (e: SelectChangeEvent) => onChangeFilter(e.target.value as Filter);
  // Меняем направление сортировки в один клик
  const toggleSort = () => onChangeSort(sort === 'newFirst' ? 'oldFirst' : 'newFirst');

  return { handleFilter, toggleSort };
}
