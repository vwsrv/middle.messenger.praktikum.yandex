/**
 * Ответ API с пользователями чата
 * @example
 * [
 *   {
 *     "id": 123,
 *     "first_name": "John",
 *     "second_name": "Doe",
 *     "display_name": "John Doe",
 *     "login": "john_doe",
 *     "avatar": "/path/to/avatar.jpg",
 *     "role": "admin"
 *   }
 * ]
 */
export interface IChatUsersResponse {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string | null;
  role: string;
}

export type TChatUsersList = IChatUsersResponse[];
