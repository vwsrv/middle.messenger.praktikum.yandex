/**
 * Запрос на добавление пользователей в чат
 * @example
 * {
 *   "users": [123, 456, 789],
 *   "chatId": 10
 * }
 */
export interface IChatAddUsersRequest {
  users: number[];
  chatId: number;
}

/**
 * Запрос на удаление пользователей из чата
 * @example
 * {
 *   "users": [123, 456, 789],
 *   "chatId": 10
 * }
 */
export interface IChatRemoveUsersRequest {
  users: number[];
  chatId: number;
}
