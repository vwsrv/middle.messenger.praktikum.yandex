/**
 * Запрос на создание чата
 * @example
 * {
 *   "title": "Новый чат",
 *   "users": [123, 456, 789]
 * }
 */
export interface IChatCreateRequest {
  title: string;
  users: number[];
}
