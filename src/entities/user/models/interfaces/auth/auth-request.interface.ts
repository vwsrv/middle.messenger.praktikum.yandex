/**
 * Запрос на авторизацию пользователя
 * @example
 * {
 *   "login": "ivan_ivanov",
 *   "password": "securePassword123"
 * }
 */
export interface ISignInRequest {
  login: string;
  password: string;
}

/**
 * Запрос на регистрацию пользователя
 * @example
 * {
 *   "first_name": "Иван",
 *   "second_name": "Иванов",
 *   "login": "ivan_ivanov",
 *   "email": "ivan@example.com",
 *   "password": "securePassword123",
 *   "phone": "+79001234567"
 * }
 */
export interface ISignUpRequest {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}
