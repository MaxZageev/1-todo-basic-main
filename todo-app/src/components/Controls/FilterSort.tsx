import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel, Button } from '@mui/material';
import { useColorMode } from '../../theme/ThemeProvider';
import ThemeSwitch from '../UI/ThemeSwitch';
import type { FilterSortProps } from '../../types/components';
import { useFilterSortHandlers } from '../../hooks/useFilterSortHandlers';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * FilterSort: Презентационный компонент панели фильтра и сортировки
 * - Обработчики вынесены в useFilterSortHandlers
 */
const FilterSort: React.FC<FilterSortProps> = ({ filter, sort, onChangeFilter, onChangeSort }) => {
  const { mode, toggle } = useColorMode();
  const { handleFilter, toggleSort } = useFilterSortHandlers(onChangeFilter, sort, onChangeSort);

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

      {/* Кнопка-тоггл для сортировки: Сначала новые/старые с иконкой стрелки */}
      <Button
        variant="outlined"
        size="small"
        onClick={toggleSort}
        startIcon={sort === 'newFirst' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        sx={{
          minWidth: 220,
          height: 40,
          px: 2,
          borderRadius: 20,
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--text)'
        }}
      >
        {sort === 'newFirst' ? 'Сначала новые' : 'Сначала старые'}
      </Button>

      <FormControlLabel
        control={<ThemeSwitch checked={mode === 'dark'} onChange={toggle} />}
        label={mode === 'dark' ? 'Dark' : 'Lite'}
      />
    </Stack>
  );
};

export default FilterSort;
