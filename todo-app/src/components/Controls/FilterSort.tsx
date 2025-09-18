import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel, Button } from '@mui/material';
import { useColorMode } from '../../theme/ThemeProvider';
import ThemeSwitch from '../UI/ThemeSwitch';
import type { FilterSortProps } from '../../types/components';
import { useFilterSortHandlers } from '../../hooks/useFilterSortHandlers';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * Компонент FilterSort: панель управления над списком задач.
 * Здесь собраны фильтр, кнопка сортировки по дате и переключатель темной/светлой темы.
 */
const FilterSort: React.FC<FilterSortProps> = ({ filter, sort, onChangeFilter, onChangeSort }) => {
  // Текущее состояние темы и переключатель из общего провайдера
  const { mode, toggle } = useColorMode();
  // Унифицируем обработчики, чтобы не повторять логику в JSX
  const { handleFilter, toggleSort } = useFilterSortHandlers(onChangeFilter, sort, onChangeSort);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
      {/* Выпадающий список фильтрует задачи по статусу */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="filter-label">Фильтр</InputLabel>
        <Select labelId="filter-label" label="Фильтр" value={filter} onChange={handleFilter}>
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="completed">Завершённые</MenuItem>
          <MenuItem value="active">Активные</MenuItem>
        </Select>
      </FormControl>

      {/* Кнопка-«качелька» меняет направление сортировки иконкой подсказывает текущий порядок */}
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

      {/* Переключатель светлой/тёмной темы приложения */}
      <FormControlLabel
        control={<ThemeSwitch checked={mode === 'dark'} onChange={toggle} />}
        label={mode === 'dark' ? 'Dark' : 'Lite'}
      />
    </Stack>
  );
};

export default FilterSort;
