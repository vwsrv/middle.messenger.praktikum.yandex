import { VALIDATION_RULES } from './constants';
import { TValidateField } from './interfaces';

export const validateField: TValidateField = (fieldName: string, value: string): string => {
  const rule = VALIDATION_RULES[fieldName];

  if (!rule) {
    return '';
  }

  if (!value.trim()) {
    return '';
  }

  const isValid = rule.pattern.test(value);
  return isValid ? '' : rule.message;
};
