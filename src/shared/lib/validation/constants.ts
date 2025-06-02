import { ValidationRules } from './types';

export const VALIDATION_RULES: ValidationRules = {
    login: [
        {
            validate: (value: string) => value.length >= 3,
            message: 'Логин должен быть не менее 3 символов'
        },
        {
            validate: (value: string) => /^[a-zA-Z0-9_-]+$/.test(value),
            message: 'Логин может содержать только латинские буквы, цифры, дефис и подчеркивание'
        }
    ],
    password: [
        {
            validate: (value: string) => value.length >= 8,
            message: 'Пароль должен быть не менее 8 символов'
        },
        {
            validate: (value: string) => /[A-Z]/.test(value),
            message: 'Пароль должен содержать хотя бы одну заглавную букву'
        },
        {
            validate: (value: string) => /[0-9]/.test(value),
            message: 'Пароль должен содержать хотя бы одну цифру'
        }
    ],
    email: [
        {
            validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Введите корректный email'
        }
    ],
    phone: [
        {
            validate: (value: string) => /^\+?[0-9]{10,15}$/.test(value),
            message: 'Введите корректный номер телефона'
        }
    ],
    name: [
        {
            validate: (value: string) => /^[А-ЯЁA-Z][а-яёa-z-]+$/.test(value),
            message: 'Имя должно начинаться с заглавной буквы и содержать только буквы и дефис'
        }
    ]
}; 
