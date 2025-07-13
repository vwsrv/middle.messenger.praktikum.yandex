import { Store } from '@/shared/lib/store';
import { IChatStore } from '@/app/resources/interfaces/chat-store.interface';
import { IChatResponse } from '@/entities/chat';
import { IMessageResponse } from '@/entities/message';

const INITIAL_STATE: IChatStore = {
  chats: [],
  currentChatId: null,
  messages: {},
  isLoading: false,
  error: null,
};

class ChatStore extends Store<IChatStore> {
  constructor() {
    super(INITIAL_STATE);
  }

  /**
   * Установить список чатов
   */
  setChats(chats: IChatResponse[]): void {
    this.set({ chats });
  }

  /**
   * Добавить новый чат
   */
  addChat(chat: IChatResponse): void {
    const currentChats = this.getState().chats;
    this.set({ chats: [...currentChats, chat] });
  }

  /**
   * Удалить чат
   */
  removeChat(chatId: number): void {
    const currentChats = this.getState().chats;
    const filteredChats = currentChats.filter(chat => chat.id !== chatId);
    this.set({ chats: filteredChats });
  }

  /**
   * Установить текущий чат
   */
  setCurrentChatId(chatId: number | null): void {
    this.set({ currentChatId: chatId });
  }

  /**
   * Установить сообщения для чата
   */
  setMessages(chatId: number, messages: IMessageResponse[]): void {
    const currentMessages = this.getState().messages;
    this.set({
      messages: {
        ...currentMessages,
        [chatId]: messages,
      },
    });
  }

  /**
   * Добавить сообщение в чат
   */
  addMessage(chatId: number, message: IMessageResponse): void {
    const currentMessages = this.getState().messages;
    const chatMessages = currentMessages[chatId] || [];

    this.set({
      messages: {
        ...currentMessages,
        [chatId]: [...chatMessages, message],
      },
    });
  }

  /**
   * Установить состояние загрузки
   */
  setLoading(isLoading: boolean): void {
    this.set({ isLoading });
  }

  /**
   * Установить ошибку
   */
  setError(error: string | null): void {
    this.set({ error });
  }

  /**
   * Получить текущий чат
   */
  getCurrentChat(): IChatResponse | null {
    const { chats, currentChatId } = this.getState();
    return chats.find(chat => chat.id === currentChatId) || null;
  }

  /**
   * Получить сообщения текущего чата
   */
  getCurrentMessages(): IMessageResponse[] {
    const { messages, currentChatId } = this.getState();
    return currentChatId ? messages[currentChatId] || [] : [];
  }

  /**
   * Очистить состояние
   */
  reset(): void {
    this.set(INITIAL_STATE);
  }
}

export const chatStore = new ChatStore();
export default ChatStore;
