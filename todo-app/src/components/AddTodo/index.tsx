import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

type Props = {
  onAdd: (text: string) => void;
};

const AddTodo: React.FC<Props> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const value = text.trim();
    if (!value) {
      setError('Поле не может быть пустым');
      return;
    }
    onAdd(value);
    setText('');
    setError(null);
  };

  return (
    <Box display="flex" gap={1}>
      <TextField
        value={text}
        onChange={(e) => { setText(e.target.value); if (error) setError(null); }}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        label="Новая задача"
        fullWidth
        error={!!error}
        helperText={error || ' '}
      />
      <Button variant="contained" onClick={submit}>Добавить</Button>
    </Box>
  );
};

export default AddTodo;
