/**
 * Ответ API с данными чата
 * @example
 * {
 *   "id": 123,
 *   "title": "Общий чат",
 *   "avatar": "/path/to/avatar.jpg",
 *   "created_by": 456,
 *   "unread_count": 2,
 *   "last_message": {
 *     "user": {
 *       "first_name": "John",
 *       "second_name": "Doe",
 *       "avatar": "/path/to/avatar.jpg",
 *       "email": "john@example.com",
 *       "login": "john_doe",
 *       "phone": "+79001234567"
 *     },
 *     "time": "2023-01-01T00:00:00.000Z",
 *     "content": "Привет!"
 *   }
 * }
 */
export interface IChatResponse {
  id: number;
  title: string;
  avatar: string | null;
  created_by: number;
  unread_count: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string | null;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}
