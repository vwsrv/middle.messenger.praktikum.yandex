/**
 * Утилита для работы с localStorage
 */
export class LocalStorage {
  private static readonly CHAT_USERS_KEY = 'chat_users_';
  private static readonly SYSTEM_MESSAGES_KEY = 'system_messages_';

  /**
   * Сохранить информацию о пользователях чата
   */
  static saveChatUsers(chatId: string, users: any[]): void {
    try {
      const key = `${this.CHAT_USERS_KEY}${chatId}`;
      localStorage.setItem(key, JSON.stringify(users));
    } catch (error) {
      console.error('Ошибка сохранения пользователей чата в localStorage:', error);
    }
  }

  /**
   * Получить информацию о пользователях чата
   */
  static getChatUsers(chatId: string): any[] {
    try {
      const key = `${this.CHAT_USERS_KEY}${chatId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка получения пользователей чата из localStorage:', error);
      return [];
    }
  }

  /**
   * Сохранить системные сообщения чата
   */
  static saveSystemMessages(chatId: string, messages: any[]): void {
    try {
      const key = `${this.SYSTEM_MESSAGES_KEY}${chatId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Ошибка сохранения системных сообщений в localStorage:', error);
    }
  }

  /**
   * Получить системные сообщения чата
   */
  static getSystemMessages(chatId: string): any[] {
    try {
      const key = `${this.SYSTEM_MESSAGES_KEY}${chatId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Ошибка получения системных сообщений из localStorage:', error);
      return [];
    }
  }

  /**
   * Добавить системное сообщение
   */
  static addSystemMessage(chatId: string, message: any): void {
    try {
      const messages = this.getSystemMessages(chatId);

      const isDuplicateById = messages.some(existingMessage => existingMessage.id === message.id);

      if (isDuplicateById) {
        console.log('LocalStorage: Системное сообщение уже существует по ID, пропускаем');
        return;
      }

      const isDuplicateByContent = messages.some(existingMessage => {
        const timeDiff = Math.abs(Date.now() - new Date(existingMessage.timestamp || 0).getTime());
        return (
          existingMessage.content === message.content &&
          existingMessage.type === message.type &&
          timeDiff < 5000
        );
      });

      if (isDuplicateByContent) {
        console.log('LocalStorage: Системное сообщение уже существует по содержимому, пропускаем');
        return;
      }

      messages.push(message);
      this.saveSystemMessages(chatId, messages);
    } catch (error) {
      console.error('Ошибка добавления системного сообщения в localStorage:', error);
    }
  }

  /**
   * Очистить данные чата
   */
  static clearChatData(chatId: string): void {
    try {
      const usersKey = `${this.CHAT_USERS_KEY}${chatId}`;
      const messagesKey = `${this.SYSTEM_MESSAGES_KEY}${chatId}`;
      localStorage.removeItem(usersKey);
      localStorage.removeItem(messagesKey);
    } catch (error) {
      console.error('Ошибка очистки данных чата из localStorage:', error);
    }
  }
}
