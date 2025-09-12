import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import type { AddTodoProps } from '../../types/components';
import { useAddTodoForm } from '../../hooks/useAddTodoForm';

/**
 * AddTodo: Презентационный компонент формы добавления
 * - Логика управления формой вынесена в useAddTodoForm
 */
const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const { text, error, submit, handleChange, handleKeyDown } = useAddTodoForm(onAdd);

  return (
    <Box display="flex" gap={2}>
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

