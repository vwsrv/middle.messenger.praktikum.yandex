import { VALIDATION_RULES } from './constants';
import { TValidateField } from './interfaces';

export const validateField: TValidateField = (fieldName: string, value: string): string => {
  const rule = VALIDATION_RULES[fieldName];

  if (!rule) {
    return '';
  }

  if (!value.trim()) {
    return fieldName === 'message' ? rule.message : '';
  }

  const isValid = rule.pattern.test(value);
  return isValid ? '' : rule.message;
};

/** Валидация формы целиком */
export const validateForm = (formData: Record<string, string>): boolean => {
  const formFields = Object.keys(formData);

  return formFields.every(fieldName => {
    const fieldValue = formData[fieldName];
    const errorMessage = validateField(fieldName, fieldValue);
    return !errorMessage;
  });
};

/** Показать ошибку валидации для поля */
export const showFieldError = (
  _fieldName: string,
  errorMessage: string,
  inputElement?: HTMLInputElement,
): void => {
  if (!inputElement) return;

  const container = inputElement.closest('.input-container') || inputElement.parentElement;
  if (!container) return;

  let errorElement = container.querySelector('.field-error') as HTMLElement;

  if (!errorElement) {
    errorElement = document.createElement('div');
    container.appendChild(errorElement);
  }

  errorElement.textContent = errorMessage;
  errorElement.style.display = errorMessage ? 'block' : 'none';

  if (errorMessage) {
    inputElement.classList.add('input-error');
  } else {
    inputElement.classList.remove('input-error');
  }
};

export const clearFieldError = (inputElement?: HTMLInputElement): void => {
  if (!inputElement) return;

  const container = inputElement.closest('.input-container') || inputElement.parentElement;
  if (!container) return;

  inputElement.classList.remove('input-error');
};
