import { useCallback, useState } from 'react';

/**
 * useTodoItem: Хук логики одной задачи в списке
 * - управление режимом редактирования, драфтом текста и разворачиванием превью
 */
export function useTodoItem(initialText: string, onEdit: (nextText: string) => void) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialText);
  const [expanded, setExpanded] = useState(false);

  const startEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(true);
  }, [initialText]);

  const cancelEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(false);
  }, [initialText]);

  const save = useCallback(() => {
    const val = draft.trim();
    if (!val) return; // Пустые значения не сохраняем
    onEdit(val);
    setEditing(false);
  }, [draft, onEdit]);

  const toggleExpanded = useCallback(() => setExpanded(prev => !prev), []);

  // Универсальный обработчик клавиатуры (подходит для MUI TextField)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancelEdit();
  }, [save, cancelEdit]);

  return {
    editing,
    draft,
    expanded,
    setDraft,
    startEdit,
    cancelEdit,
    save,
    toggleExpanded,
    handleKeyDown,
  };
}
