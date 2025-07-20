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
  static async createChat(title: string): Promise<{ id: number }> {
    const response = await api.post<{ id: number }>('/chats', {
      data: { title },
      withCredentials: true,
    });
    return response;
  }

  /**
   * Добавить пользователя в чат
   */
  static async addUserToChat(chatId: number, userId: number): Promise<void> {
    await api.put(`/chats/users`, { data: { users: [userId], chatId }, withCredentials: true });
  }

  /**
   * Удалить пользователя из чата
   */
  static async removeUserFromChat(chatId: number, userId: number): Promise<void> {
    await api.delete(`/chats/users`, { data: { users: [userId], chatId }, withCredentials: true });
  }
}
