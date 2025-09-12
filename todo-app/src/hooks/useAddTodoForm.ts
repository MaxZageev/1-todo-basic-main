import { useCallback, useState } from 'react';

/**
 * useAddTodoForm: Хук управления формой добавления задачи
 */
export function useAddTodoForm(onAdd: (text: string) => void) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(() => {
    const value = text.trim();
    if (!value) {
      setError('Введите текст задачи');
      return;
    }
    onAdd(value);
    setText('');
    setError(null);
  }, [text, onAdd]);

  const handleChange = useCallback((value: string) => {
    setText(value);
    if (error) setError(null);
  }, [error]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  }, [submit]);

  return {
    text,
    error,
    submit,
    handleChange,
    handleKeyDown,
  };
}

