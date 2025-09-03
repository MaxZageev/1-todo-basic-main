import React, { useState } from 'react';
import { Checkbox, IconButton, ListItem, ListItemText, TextField, Box, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, nextText: string) => void;
};

const TodoItem: React.FC<Props> = ({ id, text, completed, createdAt, onToggle, onDelete, onEdit }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const save = () => {
    const val = draft.trim();
    if (val) {
      onEdit(id, val);
      setEditing(false);
    }
  };

  return (
    <ListItem
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        mb: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      secondaryAction={
        <Box display="flex" gap={0.5}>
          {!editing ? (
            <Tooltip title="Редактировать">
              <IconButton edge="end" onClick={() => setEditing(true)}><EditIcon /></IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Сохранить">
                <IconButton edge="end" onClick={save}><SaveIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Удалить">
                 <IconButton edge="end" onClick={() => onDelete(id)}><DeleteIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Отмена">
                <IconButton edge="end" onClick={() => { setEditing(false); setDraft(text); }}>
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      }
    >
      <Checkbox checked={completed} onChange={() => onToggle(id)} />
      {!editing ? (
        <ListItemText
          primary={text}
          secondary={new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium', timeStyle: 'short'
          }).format(createdAt)}
          sx={{ textDecoration: completed ? 'line-through' : 'none', opacity: completed ? 0.7 : 1 }}
        />
      ) : (
        <TextField
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setEditing(false); setDraft(text); } }}
          fullWidth
          size="small"
          autoFocus
        />
      )}
    </ListItem>
  );
};

export default TodoItem;
