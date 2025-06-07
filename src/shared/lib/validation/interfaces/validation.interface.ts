export interface IValidationRule {
  pattern: RegExp;
  message: string;
}

export interface IValidationRules {
  [key: string]: IValidationRule;
}

/** Тип функции валидации поля */
export type TValidateField = (fieldName: string, value: string) => string;
