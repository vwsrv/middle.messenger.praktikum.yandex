/**
 * Запрос на отправку сообщения
 * @example
 * {
 *   "content": "Привет, как дела?",
 *   "type": "message"
 * }
 */
export interface IMessageSendRequest {
  content: string;
  type: string;
}
