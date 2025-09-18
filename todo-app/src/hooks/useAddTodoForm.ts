import { useCallback, useState } from 'react';

/**
 * useAddTodoForm: управляет состоянием формы добавления задачи.
 * Следит за текстом, валидирует ввод и отдаёт готовые обработчики для компонента AddTodo.
 */
export function useAddTodoForm(onAdd: (text: string) => void) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Отправка формы: чистим пробелы, валидируем и пробрасываем наружу
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

  // Изменение текста сбрасывает ошибку и обновляет состояние
  const handleChange = useCallback((value: string) => {
    setText(value);
    if (error) setError(null);
  }, [error]);

  // Позволяем отправлять форму клавишей Enter
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
