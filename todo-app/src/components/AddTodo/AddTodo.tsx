import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import type { AddTodoProps } from '../../types/components';
import { useAddTodoForm } from '../../hooks/useAddTodoForm';

/**
 * Компонент AddTodo: отвечает за ввод новой задачи и делегирует бизнес-логику одноимённому хуку.
 * Хук useAddTodoForm следит за текстом, валидацией и отправкой, оставляя компонент «тонким».
 */
const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  // Забираем из хука состояние поля и обработчики отправки
  const { text, error, submit, handleChange, handleKeyDown } = useAddTodoForm(onAdd);

  return (
    <Box display="flex" gap={2}>
      {/* Поле ввода текста задачи */}
      <TextField
        sx={{ minWidth: 375 }}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        label="Новая задача"
        variant="outlined"
        error={!!error}
        helperText={error || ' '}
      />

      {/* Кнопка отправки данных */}
      <Button
        sx={{ maxHeight: 56, minWidth: 112 }}
        variant="contained"
        endIcon={<AddBoxIcon />}
        onClick={submit}
      >
        Добавить
      </Button>
    </Box>
  );
};

export default AddTodo;
