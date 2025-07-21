import { TDebounceFunction, IDebounceOptions } from './types';

/**
 * Создает debounced версию функции
 * @param func - функция для debounce
 * @param options - опции с задержкой
 * @returns debounced функция
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  options: IDebounceOptions = { delay: 300 },
): TDebounceFunction<T> {
  let timeoutId: number | null = null;

  return ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      func(...args);
    }, options.delay);
  }) as TDebounceFunction<T>;
}

export default debounce;
