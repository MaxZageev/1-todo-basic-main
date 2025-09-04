import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
type Props = {
  onAdd: (text: string) => void;
};

const AddTodo: React.FC<Props> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const value = text.trim();
    if (!value) {
      setError('Бездельник получается');
      return;
    }
    onAdd(value);
    setText('');
    setError(null);
  };

  return (
    <Box display="flex" gap={2}>
      <TextField
        sx={{ minWidth: 375}}
        value={text}
        onChange={(e) => { setText(e.target.value); if (error) setError(null); }}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        label="Новая задача"
        variant="outlined"
        error={!!error}
        helperText={error || ' '}
      />
      
      <Button 
      sx={{ maxHeight: 56, minWidth: 112}}
      variant="contained"
      endIcon={<AddBoxIcon />} 
      onClick={submit}>Добавить</Button>
    </Box>
  );
};

export default AddTodo;
