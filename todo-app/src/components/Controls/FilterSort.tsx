import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel, Button } from '@mui/material';
import { useColorMode } from '../../theme/ThemeProvider';
import ThemeSwitch from '../UI/ThemeSwitch';
import type { FilterSortProps } from '../../types/components';
import { useFilterSortHandlers } from '../../hooks/useFilterSortHandlers';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * Компонент FilterSort: панель управления списком задач.
 * Здесь меняем фильтр, порядок сортировки и используем переключатель темы.
 */
const LIMIT_OPTIONS = [5, 10, 20];

const FilterSort: React.FC<FilterSortProps> = ({ filter, sort, limit, onChangeFilter, onChangeSort, onChangeLimit }) => {
  // Считываем текущую тему и переключатель из контекста ThemeProvider
  const { mode, toggle } = useColorMode();
  // Собираем обработчики, чтобы не засорять JSX логикой
  const { handleFilter, toggleSort, handleLimit } = useFilterSortHandlers(onChangeFilter, sort, onChangeSort, onChangeLimit);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
      {/* Выпадающий список фильтра по статусу */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="filter-label">Фильтр</InputLabel>
        <Select labelId="filter-label" label="Фильтр" value={filter} onChange={handleFilter}>
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="completed">Выполненные</MenuItem>
          <MenuItem value="active">Активные</MenuItem>
        </Select>
      </FormControl>

      {/* Количество задач на странице */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="limit-label">На странице</InputLabel>
        <Select labelId="limit-label" label="На странице" value={limit.toString()} onChange={handleLimit}>
          {LIMIT_OPTIONS.map((option) => (
            <MenuItem key={option} value={option.toString()}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Кнопка сортировки по дате создания */}
      <Button
        variant="outlined"
        size="small"
        onClick={toggleSort}
        endIcon={sort === 'newFirst' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
        sx={{
          minWidth: 200,
          height: 40,
          px: 2,
          borderRadius: 12,
          textTransform: 'none',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: 'var(--text)',
          justifyContent: 'space-between',
        }}
      >
        {sort === 'newFirst' ? 'Сначала новые' : 'Сначала старые'}
      </Button>

      {/* Переключатель светлой/тёмной темы */}
      <FormControlLabel
        control={<ThemeSwitch checked={mode === 'dark'} onChange={toggle} />}
        label={mode === 'dark' ? 'Dark' : 'Lite'}
      />
    </Stack>
  );
};

export default FilterSort;
