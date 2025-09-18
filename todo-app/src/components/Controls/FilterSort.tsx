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
 * Позволяет менять фильтр, порядок сортировки и переключать тему интерфейса.
 */
const FilterSort: React.FC<FilterSortProps> = ({ filter, sort, onChangeFilter, onChangeSort }) => {
  // Считываем текущую тему и переключатель из контекста ThemeProvider
  const { mode, toggle } = useColorMode();
  // Получаем готовые обработчики, чтобы JSX оставался компактным
  const { handleFilter, toggleSort } = useFilterSortHandlers(onChangeFilter, sort, onChangeSort);

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

      {/* Кнопка переключения направления сортировки по дате */}
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
