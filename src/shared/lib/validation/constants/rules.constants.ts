import { IValidationRules } from '@/shared/lib/validation';

export const VALIDATION_RULES: IValidationRules = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Неверный формат email',
  },
  login: {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
    message: 'Логин должен содержать от 3 до 20 символов.',
  },
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
    message: 'Длина пароля от 8 до 40 символов.',
  },
  first_name: {
    pattern: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
    message: 'Имя должно начинаться с заглавной буквы и содержать только буквы и дефис',
  },
  second_name: {
    pattern: /^[А-ЯЁA-Z][а-яёa-z-]*$/,
    message: 'Фамилия должна начинаться с заглавной буквы и содержать только буквы и дефис',
  },
  phone: {
    pattern: /^\+?\d{10,15}$/,
    message: 'Телефон должен содержать от 10 до 15 цифр',
  },
  message: {
    pattern: /^.+$/,
    message: 'Сообщение не может быть пустым',
  },
};
