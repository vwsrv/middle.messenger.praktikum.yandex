import { api } from '@/shared/lib/api';
import { IBaseResponse } from '@/shared/lib/api/models';
import { TMessagesList } from '@/entities/message/models/interfaces';

class MessageApi {
  private static readonly MESSAGE_ENDPOINTS = {
    MESSAGES: '/chats/{{chatId}}/messages',
    MESSAGE_FILE: '/chats/{{chatId}}/files',
  };

  /**
   * Получить сообщения чата
   */
  static async getMessages(chatId: number, offset: number = 0): Promise<TMessagesList> {
    const endpoint = MessageApi.MESSAGE_ENDPOINTS.MESSAGES.replace('{{chatId}}', chatId.toString());
    return api.get(endpoint, {
      withCredentials: true,
      data: { offset },
    });
  }

  /**
   * Отправить файл в чат
   */
  static async sendFile(chatId: number, file: FormData): Promise<IBaseResponse> {
    const endpoint = MessageApi.MESSAGE_ENDPOINTS.MESSAGE_FILE.replace(
      '{{chatId}}',
      chatId.toString(),
    );
    return api.post(endpoint, {
      data: file,
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default MessageApi;
