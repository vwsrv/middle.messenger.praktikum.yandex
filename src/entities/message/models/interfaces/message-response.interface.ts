/**
 * Ответ API с данными сообщения
 * @example
 * {
 *   "id": 123,
 *   "user_id": 456,
 *   "chat_id": 789,
 *   "type": "message",
 *   "content": "Привет, как дела?",
 *   "time": "2023-01-01T12:00:00.000Z",
 *   "is_read": false,
 *   "file": null
 * }
 */
export interface IMessageResponse {
  id: number;
  user_id: number;
  chat_id: number;
  type: string;
  content: string;
  time: string;
  is_read: boolean;
  file: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  } | null;
}

export type TMessagesList = IMessageResponse[];
