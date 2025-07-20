import EventBus from '@/shared/lib/event-bus/event-bus';
import {
  IWebSocketService,
  TWebSocketState,
  TWebSocketMessageType,
  IWebSocketMessage,
  IPingMessage,
  IGetOldMessage,
  ISendMessage,
} from '@/entities/chat/models/interfaces/websocket.interface';

class WebSocketService implements IWebSocketService {
  private socket: WebSocket | null = null;
  private chatId: number | null = null;
  private token: string | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventBus: EventBus;

  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly PING_INTERVAL = 30000; // 30 секунд
  private readonly RECONNECT_DELAY = 5000; // 5 секунд

  constructor() {
    this.eventBus = new EventBus();
  }

  async connect(chatId: number, token: string): Promise<void> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.disconnect();
    }

    this.chatId = chatId;
    this.token = token;

    const wsUrl = `wss://ya-praktikum.tech/ws/chats/${chatId}`;

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.startPingInterval();
        this.eventBus.emit('connected', { chatId });
        resolve();
      };

      this.socket.onmessage = event => {
        this.handleMessage(event.data);
      };

      this.socket.onclose = event => {
        this.handleClose(event);
      };

      this.socket.onerror = error => {
        this.eventBus.emit('error', { error, chatId });
        reject(error);
      };
    });
  }

  disconnect(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.chatId = null;
    this.token = null;
  }

  sendMessage(message: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket не подключен');
    }

    const wsMessage: ISendMessage = {
      type: TWebSocketMessageType.Message,
      content: message,
    };

    this.socket.send(JSON.stringify(wsMessage));
  }

  getOldMessages(offset: number): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket не подключен');
    }

    const wsMessage: IGetOldMessage = {
      type: TWebSocketMessageType.GetOld,
      content: offset.toString(),
    };

    this.socket.send(JSON.stringify(wsMessage));
  }

  ping(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const pingMessage: IPingMessage = {
      type: TWebSocketMessageType.Ping,
      content: '',
    };

    this.socket.send(JSON.stringify(pingMessage));
  }

  getState(): TWebSocketState {
    if (!this.socket) {
      return TWebSocketState.Closed;
    }

    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return TWebSocketState.Connecting;
      case WebSocket.OPEN:
        return TWebSocketState.Open;
      case WebSocket.CLOSING:
        return TWebSocketState.Closing;
      case WebSocket.CLOSED:
        return TWebSocketState.Closed;
      default:
        return TWebSocketState.Closed;
    }
  }

  on(event: string, callback: (...args: any[]) => void): void {
    this.eventBus.on(event, callback);
  }

  off(event: string, callback: (...args: any[]) => void): void {
    this.eventBus.off(event, callback);
  }

  private handleMessage(data: string): void {
    try {
      const message: IWebSocketMessage = JSON.parse(data);

      switch (message.type) {
        case TWebSocketMessageType.Pong:
          this.eventBus.emit('pong', { message });
          break;
        case TWebSocketMessageType.Message:
          this.eventBus.emit('message', { message });
          break;
        case TWebSocketMessageType.UserConnected:
          this.eventBus.emit('userConnected', { message });
          break;
        default:
          this.eventBus.emit('unknown', { message });
      }
    } catch (error) {
      console.error('Ошибка парсинга WebSocket сообщения:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    this.stopPingInterval();

    this.eventBus.emit('disconnected', {
      code: event.code,
      reason: event.reason,
      chatId: this.chatId,
    });

    if (event.code !== 1000 && this.chatId && this.token) {
      this.scheduleReconnect();
    }
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.ping();
    }, this.PING_INTERVAL);
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    this.reconnectTimeout = setTimeout(async () => {
      if (this.chatId && this.token) {
        try {
          await this.connect(this.chatId, this.token);
        } catch (error) {
          console.error('Ошибка переподключения:', error);
        }
      }
      this.reconnectTimeout = null;
    }, this.RECONNECT_DELAY);
  }
}

export default WebSocketService;
