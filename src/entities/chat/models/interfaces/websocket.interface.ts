/**
 * WebSocket сообщения для чатов
 */

/** Типы WebSocket сообщений */
export enum TWebSocketMessageType {
  Ping = 'ping',
  Pong = 'pong',
  GetOld = 'get old',
  Message = 'message',
  UserConnected = 'user connected',
}

/** Базовый интерфейс WebSocket сообщения */
export interface IWebSocketMessage {
  type: TWebSocketMessageType;
  content: string;
}

/** Сообщение для получения старых сообщений */
export interface IGetOldMessage extends IWebSocketMessage {
  type: TWebSocketMessageType.GetOld;
  content: string; // offset
}

/** Сообщение для отправки нового сообщения */
export interface ISendMessage extends IWebSocketMessage {
  type: TWebSocketMessageType.Message;
  content: string; // текст сообщения
}

/** Ping сообщение для поддержания соединения */
export interface IPingMessage extends IWebSocketMessage {
  type: TWebSocketMessageType.Ping;
  content: string;
}

/** Pong ответ от сервера */
export interface IPongMessage extends IWebSocketMessage {
  type: TWebSocketMessageType.Pong;
  content: string;
}

/** Уведомление о подключении пользователя */
export interface IUserConnectedMessage extends IWebSocketMessage {
  type: TWebSocketMessageType.UserConnected;
  content: string; // id подключенного пользователя
}

/** Состояние WebSocket соединения */
export enum TWebSocketState {
  Connecting = 'connecting',
  Open = 'open',
  Closing = 'closing',
  Closed = 'closed',
}

/** Интерфейс WebSocket сервиса */
export interface IWebSocketService {
  connect(chatId: number, token: string): Promise<void>;
  disconnect(): void;
  sendMessage(message: string): void;
  getOldMessages(offset: number): void;
  ping(): void;
  getState(): TWebSocketState;
}
