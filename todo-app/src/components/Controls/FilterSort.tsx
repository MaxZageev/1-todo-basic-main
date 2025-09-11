import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Filter, SortOrder } from '../../types/todo';
import { useColorMode } from '../../theme/ThemeProvider';
import ThemeSwitch from '../UI/ThemeSwitch'
import type { Props } from '../../types/props';

type FilterSortProps = Pick<Props, 'filter' | 'sort' | 'onChangeFilter' | 'onChangeSort'>;

const FilterSort: React.FC<FilterSortProps> = ({ filter, sort, onChangeFilter, onChangeSort }) => {
  const { mode, toggle } = useColorMode();

  const handleFilter = (e: SelectChangeEvent) => onChangeFilter(e.target.value as Filter);
  const handleSort = (e: SelectChangeEvent) => onChangeSort(e.target.value as SortOrder);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="filter-label">Фильтр</InputLabel>
        <Select labelId="filter-label" label="Фильтр" value={filter} onChange={handleFilter}>
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="completed">Выполненно</MenuItem>
          <MenuItem value="active">Активно</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="sort-label">Сортировка</InputLabel>
        <Select labelId="sort-label" label="Сортировка" value={sort} onChange={handleSort}>
          <MenuItem value="newFirst">Новее</MenuItem>
          <MenuItem value="oldFirst">Старее</MenuItem>
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
