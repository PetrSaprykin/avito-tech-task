import { useState, useEffect } from 'react'

/**
 * Обычный хук деабунса для оптимизаци при быстром вводе значений пользователем.
 * 
 * @template T - Тип значения
 * @param value - Значение, которое нужно отложить
 * @param delay - Задержка в миллисекундах (по умолчанию 500мс)
 * @returns Отложенное значение, которое обновится через указанную задержку
 * 
 * @example
 * const debouncedSearch = useDebounce(searchInput, 500)
 * // Запрос будет выполнен только через 500мс после последнего изменения поля поиска
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Очистка таймера при размонтировании или изменении value
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}