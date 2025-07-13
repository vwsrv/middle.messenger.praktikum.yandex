import { api } from '@/shared/lib/api';
import { IBaseResponse } from '@/shared/lib/api/models';
import {
  IChatResponse,
  IChatCreateRequest,
  IChatAddUsersRequest,
  IChatRemoveUsersRequest,
  TChatUsersList,
} from '@/entities/chat/models/interfaces';

class ChatApi {
  private static readonly CHAT_ENDPOINTS = {
    CHATS: '/chats',
    CHAT_USERS: '/chats/{{chatId}}/users',
    CHAT_ADD_USERS: '/chats/{{chatId}}/users',
    CHAT_REMOVE_USERS: '/chats/{{chatId}}/users',
    CHAT_TOKEN: '/chats/token/{{chatId}}',
  };

  /**
   * Получить все чаты пользователя
   */
  static async getChats(): Promise<IChatResponse[]> {
    return api.get(ChatApi.CHAT_ENDPOINTS.CHATS, { withCredentials: true });
  }

  /**
   * Создать новый чат
   */
  static async createChat(data: IChatCreateRequest): Promise<IBaseResponse> {
    return api.post(ChatApi.CHAT_ENDPOINTS.CHATS, { data, withCredentials: true });
  }

  /**
   * Удалить чат
   */
  static async deleteChat(chatId: number): Promise<IBaseResponse> {
    return api.delete(`${ChatApi.CHAT_ENDPOINTS.CHATS}/${chatId}`, { withCredentials: true });
  }

  /**
   * Получить пользователей чата
   */
  static async getChatUsers(chatId: number): Promise<TChatUsersList> {
    const endpoint = ChatApi.CHAT_ENDPOINTS.CHAT_USERS.replace('{{chatId}}', chatId.toString());
    return api.get(endpoint, { withCredentials: true });
  }

  /**
   * Добавить пользователей в чат
   */
  static async addChatUsers(data: IChatAddUsersRequest): Promise<IBaseResponse> {
    const endpoint = ChatApi.CHAT_ENDPOINTS.CHAT_ADD_USERS.replace(
      '{{chatId}}',
      data.chatId.toString(),
    );
    return api.put(endpoint, { data: { users: data.users }, withCredentials: true });
  }

  /**
   * Удалить пользователей из чата
   */
  static async removeChatUsers(data: IChatRemoveUsersRequest): Promise<IBaseResponse> {
    const endpoint = ChatApi.CHAT_ENDPOINTS.CHAT_REMOVE_USERS.replace(
      '{{chatId}}',
      data.chatId.toString(),
    );
    return api.delete(endpoint, { data: { users: data.users }, withCredentials: true });
  }

  /**
   * Получить токен для подключения к WebSocket чата
   */
  static async getChatToken(chatId: number): Promise<{ token: string }> {
    const endpoint = ChatApi.CHAT_ENDPOINTS.CHAT_TOKEN.replace('{{chatId}}', chatId.toString());
    return api.post(endpoint, { withCredentials: true });
  }
}

export default ChatApi;
