import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel } from '@mui/material';
import { useColorMode } from '../../theme/ThemeProvider';
import ThemeSwitch from '../UI/ThemeSwitch';
import type { FilterSortProps } from '../../types/components';
import { useFilterSortHandlers } from '../../hooks/useFilterSortHandlers';

/**
 * FilterSort: Презентационный компонент панели фильтра и сортировки
 * - Обработчики вынесены в useFilterSortHandlers
 */
const FilterSort: React.FC<FilterSortProps> = ({ filter, sort, onChangeFilter, onChangeSort }) => {
  const { mode, toggle } = useColorMode();
  const { handleFilter, handleSort } = useFilterSortHandlers(onChangeFilter, onChangeSort);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="filter-label">Фильтр</InputLabel>
        <Select labelId="filter-label" label="Фильтр" value={filter} onChange={handleFilter}>
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="completed">Завершенные</MenuItem>
          <MenuItem value="active">Активные</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="sort-label">Сортировка</InputLabel>
        <Select labelId="sort-label" label="Сортировка" value={sort} onChange={handleSort}>
          <MenuItem value="newFirst">Сначала новые</MenuItem>
          <MenuItem value="oldFirst">Сначала старые</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={<ThemeSwitch checked={mode === 'dark'} onChange={toggle} />}
        label={mode === 'dark' ? 'Dark' : 'Lite'}
      />
    </Stack>
  );
};

export default FilterSort;

