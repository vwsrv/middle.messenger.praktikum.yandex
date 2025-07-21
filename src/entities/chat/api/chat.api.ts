import { api } from '@/shared/lib/api/api';
import { IChatResponse } from '@/entities/chat/models/interfaces';

export class ChatApi {
  /**
   * Получить список чатов
   */
  static async getChats(): Promise<IChatResponse[]> {
    const response = await api.get<IChatResponse[]>('/chats', { withCredentials: true });
    return response;
  }

  /**
   * Получить токен для WebSocket подключения к чату
   */
  static async getChatToken(chatId: number): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>(`/chats/token/${chatId}`, {
      withCredentials: true,
    });
    return response;
  }

  /**
   * Создать новый чат
   */
  static async createChat(title: string, users?: number[]): Promise<{ id: number }> {
    const data: { title: string; users?: number[] } = { title };
    if (users && users.length > 0) {
      data.users = users;
    }

    const response = await api.post<{ id: number }>('/chats', {
      data,
      withCredentials: true,
    });
    return response;
  }

  /**
   * Добавить пользователя в чат
   */
  static async addUserToChat(chatId: number, userId: number): Promise<void> {
    try {
      await api.put(`/chats/users`, {
        data: { users: [userId], chatId },
        withCredentials: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes('cookie') ||
        errorMessage.includes('auth') ||
        errorMessage.includes('401')
      ) {
        throw new Error('Ошибка авторизации: cookie is not valid');
      }

      if (errorMessage.includes('404')) {
        throw new Error('Чат не найден');
      }

      if (errorMessage.includes('400')) {
        throw new Error('Некорректные данные запроса');
      }

      throw new Error('Ошибка добавления пользователя в чат');
    }
  }

  /**
   * Удалить пользователя из чата
   */
  static async removeUserFromChat(chatId: number, userId: number): Promise<void> {
    return api.delete('/chats/users', {
      data: { users: [userId], chatId },
      withCredentials: true,
    });
  }

  /**
   * Удалить чат
   */
  static async deleteChat(chatId: number): Promise<void> {
    await api.delete(`/chats`, {
      data: { chatId },
      withCredentials: true,
    });
  }

  /**
   * Получить список пользователей чата
   */
  static async getChatUsers(chatId: number): Promise<any[]> {
    return api.get(`/chats/${chatId}/users`, { withCredentials: true });
  }
}
