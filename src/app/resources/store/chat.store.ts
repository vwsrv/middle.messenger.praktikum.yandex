import { Store } from '@/shared/lib/store';
import { IChatStore } from '@/app/resources/interfaces/chat-store.interface';
import { IChatResponse } from '@/entities/chat';
import { IMessageResponse } from '@/entities/message';
import { webSocketManager } from '@/entities/chat/api';

const INITIAL_STATE: IChatStore = {
  chats: [],
  currentChatId: null,
  messages: {},
  isLoading: false,
  error: null,
};

interface IChatStoreInstance extends Store<IChatStore> {
  setChats(chats: IChatResponse[]): void;
  addChat(chat: IChatResponse): void;
  removeChat(chatId: number): void;
  setCurrentChatId(chatId: number | null): void;
  setMessages(chatId: number, messages: IMessageResponse[]): void;
  addMessage(chatId: number, message: IMessageResponse): void;
  setLoading(isLoading: boolean): void;
  setError(error: string | null): void;
  getCurrentChat(): IChatResponse | null;
  getCurrentMessages(): IMessageResponse[];
  connectToChat(chatId: number): Promise<void>;
  disconnectFromChat(chatId: number): void;
  sendMessage(chatId: number, message: string): void;
  reset(): void;
}

class ChatStore extends Store<IChatStore> implements IChatStoreInstance {
  private static instance: ChatStore | null = null;
  private webSocketListenersInitialized = false;

  constructor() {
    super(INITIAL_STATE);
  }

  /**
   * Инициализировать WebSocket слушатели
   */
  private initializeWebSocketListeners(): void {
    if (this.webSocketListenersInitialized) {
      return;
    }

    if (webSocketManager && typeof webSocketManager.onMessage === 'function') {
      this.setupWebSocketListeners();
      this.webSocketListenersInitialized = true;
    }
  }

  /**
   * Получить экземпляр ChatStore (Singleton)
   */
  public static getInstance(): ChatStore {
    if (!ChatStore.instance) {
      ChatStore.instance = new ChatStore();
    }
    return ChatStore.instance;
  }

  /**
   * Настроить слушатели WebSocket событий
   */
  private setupWebSocketListeners(): void {
    if (!webSocketManager) {
      return;
    }

    webSocketManager.onMessage(message => {
      const chatId = webSocketManager.getChatId();
      if (chatId) {
        this.handleWebSocketMessage(chatId, message);
      }
    });

    webSocketManager.onError(error => {
      console.error('WebSocket ошибка в store:', error);
      this.setError('Ошибка WebSocket соединения');
    });

    webSocketManager.onClose(() => {
      console.log('WebSocket соединение закрыто в store');
    });
  }

  /**
   * Обработать сообщение от WebSocket
   */
  private handleWebSocketMessage(chatId: number, message: any): void {
    const messageResponse: IMessageResponse = {
      id: parseInt(message.id),
      user_id: parseInt(message.user_id),
      chat_id: chatId,
      type: message.type,
      content: message.content,
      time: message.time,
      is_read: false,
      file: message.file || null,
    };

    this.addMessage(chatId, messageResponse);
  }

  /**
   * Подключиться к WebSocket чата
   */
  async connectToChat(chatId: number): Promise<void> {
    try {
      this.setLoading(true);
      this.setError(null);

      await webSocketManager.connect(chatId);
      this.setCurrentChatId(chatId);
      this.initializeWebSocketListeners();
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Ошибка подключения к чату');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Отключиться от WebSocket чата
   */
  disconnectFromChat(chatId: number): void {
    webSocketManager.disconnect();
    if (this.getState().currentChatId === chatId) {
      this.setCurrentChatId(null);
    }
  }

  /**
   * Отправить сообщение через WebSocket
   */
  sendMessage(_chatId: number, message: string): void {
    try {
      webSocketManager.sendMessage(message);
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Ошибка отправки сообщения');
      throw error;
    }
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

    this.disconnectFromChat(chatId);
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
    webSocketManager.disconnect();
  }
}

export const chatStoreInstance = new ChatStore();
export type { IChatStoreInstance };
export default ChatStore;
