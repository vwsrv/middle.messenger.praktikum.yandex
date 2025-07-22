import { ChatApi } from './chat.api';
import { authStore } from '@/app/resources/store/auth.store';

export interface IWebSocketMessage {
  type: string;
  content: string;
  time: string;
  user_id: number;
  id: number;
}

export interface IWebSocketManager {
  connect(chatId: number): Promise<void>;
  disconnect(): void;
  sendMessage(content: string): void;
  getOldMessages(offset: number): void;
  onMessage(callback: (message: IWebSocketMessage) => void): void;
  onError(callback: (error: Event) => void): void;
  onClose(callback: () => void): void;
  removeMessageListener(callback: (message: IWebSocketMessage) => void): void;
  removeErrorListener(callback: (error: Event) => void): void;
  removeCloseListener(callback: () => void): void;
  clearAllListeners(): void;
}

class WebSocketManager implements IWebSocketManager {
  private ws: WebSocket | null = null;
  private chatId: number | null = null;
  private messageCallbacks: ((message: IWebSocketMessage) => void)[] = [];
  private errorCallbacks: ((error: Event) => void)[] = [];
  private closeCallbacks: (() => void)[] = [];

  async connect(chatId: number, onOpen?: () => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Проверяем состояние авторизации
        const isAuthenticated = authStore.getIsAuth();
        const user = authStore.getUser();

        if (!isAuthenticated) {
          reject(new Error('Пользователь не авторизован'));
          return;
        }

        ChatApi.getChatToken(chatId)
          .then(({ token }) => {
            // Используем прямой URL к API без прокси
            const userId = user?.id;
            const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;

            this.ws = new WebSocket(wsUrl);
            this.chatId = chatId;

            this.ws.onopen = () => {
              if (onOpen) {
                onOpen();
              }
              resolve();
            };

            this.ws.onmessage = event => {
              try {
                const data = JSON.parse(event.data);

                if (Array.isArray(data)) {
                  if (data.length === 0) {
                  } else {
                    data.forEach(message => {
                      this.messageCallbacks.forEach(callback => callback(message));
                    });
                  }
                } else if (data && typeof data === 'object') {
                  this.messageCallbacks.forEach(callback => callback(data));
                }
              } catch {}
            };

            this.ws.onerror = error => {
              this.errorCallbacks.forEach(callback => callback(error));
              reject(error);
            };

            this.ws.onclose = () => {
              this.closeCallbacks.forEach(callback => callback());
            };
          })
          .catch(error => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.chatId = null;
    }
  }

  sendMessage(content: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        content,
        type: 'message',
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  getOldMessages(offset: number): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = {
        content: offset.toString(),
        type: 'get old',
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(callback: (message: IWebSocketMessage) => void): void {
    this.messageCallbacks.push(callback);
  }

  onError(callback: (error: Event) => void): void {
    this.errorCallbacks.push(callback);
  }

  onClose(callback: () => void): void {
    this.closeCallbacks.push(callback);
  }

  removeMessageListener(callback: (message: IWebSocketMessage) => void): void {
    const index = this.messageCallbacks.indexOf(callback);
    if (index > -1) {
      this.messageCallbacks.splice(index, 1);
    }
  }

  removeErrorListener(callback: (error: Event) => void): void {
    const index = this.errorCallbacks.indexOf(callback);
    if (index > -1) {
      this.errorCallbacks.splice(index, 1);
    }
  }

  removeCloseListener(callback: () => void): void {
    const index = this.closeCallbacks.indexOf(callback);
    if (index > -1) {
      this.closeCallbacks.splice(index, 1);
    }
  }

  clearAllListeners(): void {
    this.messageCallbacks = [];
    this.errorCallbacks = [];
    this.closeCallbacks = [];
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getChatId(): number | null {
    return this.chatId;
  }
}

export const webSocketManager = new WebSocketManager();
