import Block from '../../shared/lib/block/block';
import template from './chat-layout.hbs?raw';
import { IChat, IProps } from './types/types';
import ChatSideBar from './ui/chat-sidebar/chat-sidebar';
import ChatHeader from './ui/chat-header/chat-header';
import ChatDialog from './ui/chat-dialog/chat-dialog';
import ChatTextArea from './ui/chat-textarea/chat-textarea';
import ChatDialogEmpty from './ui/chat-dialog-empty/chat-dialog-empty';
import CreateChatModal from '../create-chat-modal/create-chat-modal';
import AddUsersModal from '../add-users-modal/add-users-modal';
import DeleteUserModal from '../delete-user-modal/delete-user-modal';
import { mapMessageFromWebSocket } from '@/entities/chat/utils/chat-mapper';
import { webSocketManager } from '@/entities/chat/api/websocket-manager';
import { authStore } from '@/app/resources/store/auth.store';
import { LocalStorage } from '@/shared/utils/local-storage';
import { routerProvider } from '@/app/providers/router/router-provider';

class ChatLayout extends Block {
  private sidebarComponent!: ChatSideBar;
  private createChatModal!: CreateChatModal;
  private addUsersModal!: AddUsersModal;
  private messages: any[] = [];
  private systemMessages: any[] = [];
  private messageCallbacks: Array<(message: any) => void> = [];
  private errorCallbacks: Array<(error: Event) => void> = [];
  private closeCallbacks: Array<() => void> = [];
  private deleteUserModal!: DeleteUserModal;

  constructor(props: IProps) {
    const sidebarComponent = new ChatSideBar({
      chats: props.chats || [],
      selectedChatId: props.activeChat?.id,
      onChatSelect: (chatId: string) => {
        this.handleChatSelect(chatId);
      },
      onProfileClick: () => {},
      onSearch: (_query: string) => {},
      onCreateChat: () => {
        this.createChatModal.setProps({ isOpen: true });
      },
    });

    const createChatModal = new CreateChatModal({
      isOpen: false,
      onClose: () => {
        this.createChatModal.setProps({ isOpen: false });
      },
      onCreateChat: async (title: string) => {
        await this.handleCreateChatOnly(title);
      },
    });

    const addUsersModal = new AddUsersModal({
      isOpen: false,
      activeChatId: props.activeChat?.id,
      onClose: () => {
        this.addUsersModal.setProps({ isOpen: false });
      },
      onAddUsersToChat: async (users: any[]) => {
        const currentChatId = props.activeChat?.id;

        if (currentChatId) {
          await this.handleAddUsersToChat(currentChatId, users);
        } else {
          console.error('ChatLayout: currentChatId не определен');
        }
      },
      onUserAddedToChat: async (_chatId: number, _userId: number) => {},
      onSystemMessage: (systemMessage: any) => {
        this.addSystemMessage(systemMessage);
      },
    });

    const deleteUserModal = new DeleteUserModal({
      isOpen: false,
      activeChatId: props.activeChat?.id,
      onClose: () => {
        this.deleteUserModal.setProps({ isOpen: false });
      },
      onUserDeleted: (_userId: number) => {},
      onSystemMessage: (systemMessage: any) => {
        this.addSystemMessage(systemMessage);
      },
    });

    super('div', {
      ...props,
      className: 'chat-page',
      ChatSideBarComponent: sidebarComponent,
      CreateChatModalComponent: createChatModal,
      AddUsersModalComponent: addUsersModal,
      DeleteUserModalComponent: deleteUserModal,

      ChatHeaderComponent: props.activeChat
        ? new ChatHeader({
            profileName: props.activeChat.profileName,
            profileAvatar: props.activeChat.avatar,
            onMenuClick: (): void => {},
            onAddUser: (): void => {
              const currentChatId = props.activeChat?.id;

              this.addUsersModal.setProps({
                isOpen: true,
                activeChatId: currentChatId,
                onAddUsersToChat: async (users: any[]) => {
                  if (currentChatId) {
                    await this.handleAddUsersToChat(currentChatId, users);
                  } else {
                    console.error('ChatLayout: currentChatId не определен');
                  }
                },
              });
            },
            onDeleteChat: () => {
              void this.handleDeleteChat(props.activeChat!.id);
            },
            onDeleteUser: () => {
              this.openDeleteUserModal();
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
            onAttachFile: () => {},
          })
        : null,
      ChatDialogEmptyComponent: !props.activeChat ? new ChatDialogEmpty() : null,
    });

    this.sidebarComponent = sidebarComponent;
    this.createChatModal = createChatModal;
    this.addUsersModal = addUsersModal;
    this.deleteUserModal = deleteUserModal;
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

    const errorCallback = (_: Event) => {};

    const closeCallback = () => {};

    this.messageCallbacks.push(messageCallback);
    this.errorCallbacks.push(errorCallback);
    this.closeCallbacks.push(closeCallback);

    webSocketManager.onMessage(messageCallback);
    webSocketManager.onError(errorCallback);
    webSocketManager.onClose(closeCallback);
  }

  private addMessage(message: any): void {
    try {
      const user = authStore.getUser();
      if (!user) {
        return;
      }

      if (message.type === 'user connected' || message.type === 'user_connected') {
        this.handleUserConnected(message);
        return;
      }

      const mappedMessage = mapMessageFromWebSocket(message, user.id);

      const isDuplicate = this.messages.some(
        existingMessage => existingMessage.id === mappedMessage.id,
      );

      if (isDuplicate) {
        return;
      }

      this.messages.push(mappedMessage);

      this.messages.sort((a, b) => {
        const timeA = new Date(a.originalTime || a.time).getTime();
        const timeB = new Date(b.originalTime || b.time).getTime();
        return timeA - timeB;
      });

      if (this.children.ChatDialogComponent) {
        const chatDialogComponent = this.children.ChatDialogComponent as any;
        if (typeof chatDialogComponent.updateMessages === 'function') {
          chatDialogComponent.updateMessages(this.messages);
          this._render();
        }
      }
    } catch {}
  }

  private handleUserConnected(message: any): void {
    try {
      const systemMessage = {
        id: `system_ws_${Date.now()}_${message.user_id || 'unknown'}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'user_joined' as const,
        content: message.content || 'Пользователь присоединился к чату',
        timestamp: Date.now(),
      };

      this.addSystemMessage(systemMessage);
    } catch (error) {
      console.error('Ошибка при обработке userConnected сообщения:', error);
    }
  }

  private addSystemMessage(systemMessage: any): void {
    try {
      const isDuplicateById = this.systemMessages.some(
        existingMessage => existingMessage.id === systemMessage.id,
      );

      if (isDuplicateById) {
        return;
      }

      const isDuplicateByContent = this.systemMessages.some(existingMessage => {
        const timeDiff = Math.abs(Date.now() - new Date(existingMessage.timestamp || 0).getTime());
        return (
          existingMessage.content === systemMessage.content &&
          existingMessage.type === systemMessage.type &&
          timeDiff < 5000
        );
      });

      if (isDuplicateByContent) {
        return;
      }

      const messageWithTimestamp = {
        ...systemMessage,
        timestamp: Date.now(),
      };

      this.systemMessages = [...this.systemMessages, messageWithTimestamp];

      const currentChatId = this.props.activeChat?.id;
      if (currentChatId) {
        LocalStorage.addSystemMessage(currentChatId, messageWithTimestamp);
      }

      if (this.children.ChatDialogComponent) {
        const chatDialogComponent = this.children.ChatDialogComponent as any;
        if (typeof chatDialogComponent.updateSystemMessages === 'function') {
          chatDialogComponent.updateSystemMessages(this.systemMessages);
        }
      }
    } catch {}
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
        webSocketManager.disconnect();

        this.messages = [];
        this.systemMessages = [];

        LocalStorage.clearChatData(selectedChat.id);

        const savedSystemMessages = LocalStorage.getSystemMessages(selectedChat.id);

        const uniqueSystemMessages = savedSystemMessages.filter((message, index, array) => {
          const firstIndex = array.findIndex(m => m.id === message.id);
          return firstIndex === index;
        });

        this.systemMessages = uniqueSystemMessages || [];

        newChildren.ChatHeaderComponent = new ChatHeader({
          profileName: selectedChat.profileName,
          profileAvatar: selectedChat.avatar,
          onAddUser: () => {
            const currentChatId = selectedChat.id;

            this.addUsersModal.setProps({
              isOpen: true,
              activeChatId: currentChatId,
            });
          },
          onDeleteChat: () => {
            this.handleDeleteChat(selectedChat.id);
          },
          onDeleteUser: () => {
            this.openDeleteUserModal();
          },
        });

        newChildren.ChatDialogComponent = new ChatDialog({
          createDate: 'Здесь будет история сообщений',
          messages: this.messages,
          systemMessages: this.systemMessages,
        });

        newChildren.ChatTextAreaComponent = new ChatTextArea({
          onSendMessage: (message: string) => {
            this.handleSendMessage(message);
          },
          onAttachFile: () => {
            // TODO: Прикрепить файл
          },
        });

        newChildren.ChatDialogEmptyComponent = null;

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

        this.addUsersModal.setProps({
          activeChatId: selectedChat.id,
          onAddUsersToChat: async (users: any[]) => {
            await this.handleAddUsersToChat(selectedChat.id, users);
          },
          onUserAddedToChat: async (_chatId: number, _userId: number) => {},
          onSystemMessage: (systemMessage: any) => {
            this.addSystemMessage(systemMessage);
          },
        });

        this.deleteUserModal.setProps({ activeChatId: selectedChat.id });

        this._render();

        this.setupWebSocketListeners();

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

  private handleCreateChatOnly = async (title: string): Promise<void> => {
    try {
      const user = authStore.getUser();
      if (!user) {
        throw new Error('User must be authorized by contract');
      }

      const { ChatApi } = await import('@/entities/chat/api/chat.api');
      const chatResponse = await ChatApi.createChat(title, []);

      if (chatResponse && chatResponse.id) {
        await webSocketManager.connect(chatResponse.id);

        const newChat: IChat = {
          id: chatResponse.id.toString(),
          profileName: title,
          avatar: user.avatar || '',
          sentTime: new Date().toISOString(),
          messageText: '',
          messages: [],
        };

        const currentChats = this.props.chats || [];
        const updatedChats = [...currentChats, newChat];
        this.updateChats(updatedChats);

        this.handleChatSelect(newChat.id);

        this.createChatModal.setProps({ isOpen: false });
      }
    } catch (_error) {
      const errorMessage = _error instanceof Error ? _error.message : String(_error);
      if (
        errorMessage.includes('cookie') ||
        errorMessage.includes('auth') ||
        errorMessage.includes('401')
      ) {
        routerProvider.navigateTo('/');
        return;
      }
      alert('Ошибка создания чата. Попробуйте еще раз.');
    }
  };

  private handleAddUsersToChat = async (chatId: string, users: any[]): Promise<void> => {
    try {
      const user = authStore.getUser();
      if (!user) {
        throw new Error('User must be authorized by contract');
      }

      const { ChatApi } = await import('@/entities/chat/api/chat.api');

      for (const selectedUser of users) {
        await ChatApi.addUserToChat(parseInt(chatId), selectedUser.id);
      }
      const currentChatId = this.props.activeChat?.id;
      if (currentChatId) {
        const existingUsers = LocalStorage.getChatUsers(currentChatId);
        const updatedUsers = [...existingUsers, ...users];
        LocalStorage.saveChatUsers(currentChatId, updatedUsers);
      }

      const currentChats = this.props.chats || [];
      const updatedChats = currentChats.map((chat: IChat) => {
        if (chat.id === chatId) {
          const newNames = users
            .map(u => u.display_name || `${u.first_name} ${u.second_name}`.trim())
            .join(', ');
          return {
            ...chat,
            profileName: `${chat.profileName} (${newNames})`,
          };
        }
        return chat;
      });
      this.updateChats(updatedChats);

      if (this.children.ChatDialogComponent) {
        const chatDialogComponent = this.children.ChatDialogComponent as any;
        if (typeof chatDialogComponent.updateMessages === 'function') {
          chatDialogComponent.updateMessages(this.messages);
          this._render();
        }
      }

      users.forEach((addedUser: any) => {
        const fullName = [addedUser.first_name, addedUser.second_name].filter(Boolean).join(' ');
        const systemMessage = {
          id: `system_add_${Date.now()}_${addedUser.id}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'user_joined',
          content: `Пользователь добавлен: ${fullName}`,
          timestamp: Date.now(),
        };
        this.addSystemMessage(systemMessage);
      });
    } catch (_error) {
      const errorMessage = _error instanceof Error ? _error.message : String(_error);
      if (
        errorMessage.includes('cookie') ||
        errorMessage.includes('auth') ||
        errorMessage.includes('401')
      ) {
        routerProvider.navigateTo('/');
        return;
      }
      alert('Ошибка добавления пользователей в чат. Попробуйте еще раз.');
    }
  };

  private handleDeleteChat = async (chatId: string): Promise<void> => {
    const selectedChat = this.props.chats?.find((chat: IChat) => chat.id === chatId);
    if (!selectedChat) {
      console.error('Чат не найден');
      return;
    }

    const isConfirmed = confirm(
      `Вы уверены, что хотите удалить чат "${selectedChat.profileName}"?`,
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const user = authStore.getUser();
      if (!user) {
        throw new Error('User must be authorized by contract');
      }

      const { ChatApi } = await import('@/entities/chat/api/chat.api');
      await ChatApi.deleteChat(parseInt(chatId));

      const currentChats = this.props.chats || [];
      const updatedChats = currentChats.filter((chat: IChat) => chat.id !== chatId);
      this.updateChats(updatedChats);

      if (this.props.activeChat?.id === chatId) {
        webSocketManager.disconnect();
        this.messages = [];
        this.systemMessages = [];

        this.setProps({
          activeChat: null,
          ChatHeaderComponent: null,
          ChatDialogComponent: null,
          ChatTextAreaComponent: null,
          ChatDialogEmptyComponent: new ChatDialogEmpty(),
        });
        this._render();
      }
    } catch (_error) {
      const errorMessage = _error instanceof Error ? _error.message : String(_error);
      if (
        errorMessage.includes('cookie') ||
        errorMessage.includes('auth') ||
        errorMessage.includes('401')
      ) {
        routerProvider.navigateTo('/');
        return;
      }
      alert('Ошибка удаления чата. Попробуйте еще раз.');
    }
  };

  private openDeleteUserModal = () => {
    this.deleteUserModal.setProps({
      isOpen: true,
      activeChatId: this.props.activeChat?.id,
    });
  };

  render(): string {
    return template;
  }

  componentDidMount(): void {
    if (typeof window !== 'undefined') {
      (window as any).__openDeleteUserModal = this.openDeleteUserModal.bind(this);
    }
  }
}

export default ChatLayout;
