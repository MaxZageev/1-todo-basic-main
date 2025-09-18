// Хук для управления состоянием отдельной задачи.
// Позволяет редактировать текст, разворачивать описание и обрабатывать клавиши.
import { useCallback, useState } from 'react';

/**
 * useTodoItem: инкапсулирует поведение отдельной задачи.
 * Управляет режимом редактирования, текстовым черновиком и раскрытием длинного описания.
 */
export function useTodoItem(initialText: string, onEdit: (nextText: string) => void) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialText);
  const [expanded, setExpanded] = useState(false);

  // Входим в режим редактирования с актуальным текстом
  const startEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(true);
  }, [initialText]);

  // Отменяем редактирование, откатывая черновик
  const cancelEdit = useCallback(() => {
    setDraft(initialText);
    setEditing(false);
  }, [initialText]);

  // Сохраняем текст после обрезки пробелов; пустые строки игнорируем
  const save = useCallback(() => {
    const val = draft.trim();
    if (!val) return;
    onEdit(val);
    setEditing(false);
  }, [draft, onEdit]);

  // Разворачиваем/сворачиваем длинное описание
  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  // Универсальный обработчик клавиатуры для поля ввода (MUI TextField)
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
