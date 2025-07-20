import Block from '../../shared/lib/block/block';
import template from './chat-layout.hbs?raw';
import { IChat, IProps } from './types/types';
import ChatSideBar from './ui/chat-sidebar/chat-sidebar';
import ChatHeader from './ui/chat-header/chat-header';
import ChatDialog from './ui/chat-dialog/chat-dialog';
import ChatTextArea from './ui/chat-textarea/chat-textarea';
import ChatDialogEmpty from './ui/chat-dialog-empty/chat-dialog-empty';
import { mapMessageFromWebSocket } from '@/entities/chat/utils/chat-mapper';
import { webSocketManager } from '@/entities/chat/api/websocket-manager';

class ChatLayout extends Block {
  private sidebarComponent!: ChatSideBar;
  private messages: any[] = [];
  private messageCallbacks: Array<(message: any) => void> = [];
  private errorCallbacks: Array<(error: Event) => void> = [];
  private closeCallbacks: Array<() => void> = [];

  constructor(props: IProps) {
    const sidebarComponent = new ChatSideBar({
      chats: props.chats || [],
      selectedChatId: props.activeChat?.id,
      onChatSelect: (chatId: string) => {
        this.handleChatSelect(chatId);
      },
      onProfileClick: () => {
        // Переход в профиль
      },
      onSearch: (_query: string) => {
        // Поиск
      },
    });

    super('div', {
      ...props,
      className: 'chat-page',
      ChatSideBarComponent: sidebarComponent,

      ChatHeaderComponent: props.activeChat
        ? new ChatHeader({
            profileName: props.activeChat.profileName,
            profileAvatar: props.activeChat.avatar,
            onMenuClick: () => {
              // Открыть меню чата
            },
          })
        : null,

      ChatDialogComponent: props.activeChat
        ? new ChatDialog({
            createDate: 'Сегодня',
            messages: props.activeChat.messages,
          })
        : null,

      ChatTextAreaComponent: props.activeChat
        ? new ChatTextArea({
            onSendMessage: (message: string) => {
              this.handleSendMessage(message);
            },
            onAttachFile: () => {
              // Прикрепить файл
            },
          })
        : null,
      ChatDialogEmptyComponent: !props.activeChat ? new ChatDialogEmpty() : null,
    });

    this.sidebarComponent = sidebarComponent;
  }

  private clearWebSocketListeners(): void {
    this.messageCallbacks.forEach(callback => {
      webSocketManager.removeMessageListener(callback);
    });
    this.errorCallbacks.forEach(callback => {
      webSocketManager.removeErrorListener(callback);
    });
    this.closeCallbacks.forEach(callback => {
      webSocketManager.removeCloseListener(callback);
    });

    this.messageCallbacks = [];
    this.errorCallbacks = [];
    this.closeCallbacks = [];

    webSocketManager.disconnect();
  }

  private setupWebSocketListeners(): void {
    this.clearWebSocketListeners();

    const messageCallback = (message: any) => {
      this.addMessage(message);
    };

    const errorCallback = (error: Event) => {
      console.error('WebSocket ошибка:', error);
    };

    const closeCallback = () => {
      // WebSocket соединение закрыто
    };

    this.messageCallbacks.push(messageCallback);
    this.errorCallbacks.push(errorCallback);
    this.closeCallbacks.push(closeCallback);

    webSocketManager.onMessage(messageCallback);
    webSocketManager.onError(errorCallback);
    webSocketManager.onClose(closeCallback);
  }

  private addMessage(message: any): void {
    try {
      const mappedMessage = mapMessageFromWebSocket(message);

      const isDuplicate = this.messages.some(
        existingMessage => existingMessage.id === mappedMessage.id,
      );

      if (isDuplicate) {
        return;
      }

      this.messages.push(mappedMessage);

      this.messages.sort((a, b) => {
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeA - timeB;
      });

      if (this.children.ChatDialogComponent) {
        const chatDialogComponent = this.children.ChatDialogComponent as any;
        if (typeof chatDialogComponent.updateMessages === 'function') {
          chatDialogComponent.updateMessages(this.messages);
          this._render();
        }
      }
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
    }
  }

  /**
   * Обновить ChatLayout с новыми данными
   */
  public updateChats(chats: IChat[]): void {
    if (this.sidebarComponent) {
      this.sidebarComponent.updateProps({
        chats,
      });
    }

    this.setProps({ chats });
    this._render();
  }

  private handleChatSelect = async (chatId: string): Promise<void> => {
    const selectedChat = this.props.chats?.find((chat: IChat) => chat.id === chatId);

    this.sidebarComponent.updateSelectedChat(chatId);

    const newChildren: Record<string, Block | null> = {};

    if (selectedChat) {
      try {
        // Отключиться от предыдущего чата
        webSocketManager.disconnect();

        // Очистить сообщения для нового чата
        this.messages = [];

        // Создаем компоненты чата
        newChildren.ChatHeaderComponent = new ChatHeader({
          profileName: selectedChat.profileName,
          profileAvatar: selectedChat.avatar,
          onMenuClick: () => {
            // Открыть меню чата
          },
        });

        newChildren.ChatDialogComponent = new ChatDialog({
          createDate: 'Здесь будет история сообщений',
          messages: this.messages,
        });

        newChildren.ChatTextAreaComponent = new ChatTextArea({
          onSendMessage: (message: string) => {
            this.handleSendMessage(message);
          },
          onAttachFile: () => {
            // Прикрепить файл
          },
        });

        newChildren.ChatDialogEmptyComponent = null;

        // Обновляем children и props
        Object.entries(newChildren).forEach(([key, component]) => {
          if (component) {
            this.children[key] = component;
          } else {
            delete this.children[key];
          }
        });

        this.setProps({
          ...newChildren,
        });

        this._render();

        // Настраиваем слушатели WebSocket
        this.setupWebSocketListeners();

        // Подключаемся к WebSocket для получения новых сообщений
        await webSocketManager.connect(parseInt(chatId), () => {
          webSocketManager.getOldMessages(0);
        });
      } catch (error) {
        console.error('Ошибка подключения к чату:', error);
        newChildren.ChatDialogEmptyComponent = new ChatDialogEmpty();
      }
    } else {
      webSocketManager.disconnect();
      this.messages = [];

      newChildren.ChatHeaderComponent = null;
      newChildren.ChatDialogComponent = null;
      newChildren.ChatTextAreaComponent = null;
      newChildren.ChatDialogEmptyComponent = new ChatDialogEmpty();
    }

    if (this.props.onChatSelect) {
      this.props.onChatSelect(chatId);
    }
  };

  private handleSendMessage = (message: string): void => {
    if (webSocketManager.isConnected()) {
      try {
        webSocketManager.sendMessage(message);

        if (this.props.onSendMessage) {
          this.props.onSendMessage(message);
        }
      } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
      }
    } else {
      console.error('WebSocket не подключен');
    }
  };

  render(): string {
    return template;
  }
}

export default ChatLayout;
