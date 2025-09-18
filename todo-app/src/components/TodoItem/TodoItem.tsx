// Карточка отдельной задачи.
// Позволяет переключать статус, редактировать текст, удалять задачу и разворачивать длинное описание.
import React from 'react';
import { Checkbox, IconButton, ListItem, ListItemText, TextField, Box, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import type { TodoItemProps } from '../../types/components';
import { useTodoItem } from '../../hooks/useTodoItem';

const MAX_PREVIEW_HEIGHT = 25; // Ограничение высоты текста, пока карточка «свёрнута»

/**
 * Компонент TodoItem: отдельная карточка задачи с режимом просмотра и редактирования.
 * Состояние редактирования, черновик текста и раскрытие длинного описания хранит хук useTodoItem.
 */
const TodoItem: React.FC<TodoItemProps> = ({ id, text, completed, createdAt, onToggle, onDelete, onEdit }) => {
  // Достаём из хука все управляющие флаги и обработчики для карточки
  const { editing, draft, expanded, setDraft, startEdit, cancelEdit, save, toggleExpanded, handleKeyDown } = useTodoItem(
    text,
    (next) => onEdit(id, next)
  );

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        mb: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Чекбокс завершённости */}
      <Checkbox checked={completed} onChange={() => onToggle(id)} sx={{ mt: 0.5 }} />

      <Box sx={{ flex: 1, mr: 1 }}>
        {!editing ? (
          <>
            {/* Просмотр задачи */}
            <ListItemText
              primary={
                <Typography
                  component="span"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: expanded ? 'none' : MAX_PREVIEW_HEIGHT,
                    overflow: 'hidden',
                    textDecoration: completed ? 'line-through' : 'none',
                    opacity: completed ? 0.7 : 1,
                    display: 'block',
                  }}
                >
                  {text}
                </Typography>
              }
              secondary={new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(createdAt)}
            />

            {/* Кнопка «развернуть/свернуть» появляется только для длинных описаний */}
            {text.length > 120 && (
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', mt: 0.5 }} onClick={toggleExpanded}>
                {expanded ? 'Скрыть' : 'Показать полностью'}
              </Typography>
            )}
          </>
        ) : (
          // Режим редактирования
          <TextField
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            size="small"
            autoFocus
            multiline
          />
        )}
      </Box>

      <Box display="flex" gap={0.5} alignItems="flex-start">
        {!editing ? (
          <Tooltip title="Редактировать">
            <IconButton edge="end" onClick={startEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Сохранить">
              <IconButton edge="end" onClick={save}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton edge="end" onClick={() => onDelete(id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Отмена">
              <IconButton edge="end" onClick={cancelEdit}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
    </ListItem>
  );
};

export default TodoItem;
