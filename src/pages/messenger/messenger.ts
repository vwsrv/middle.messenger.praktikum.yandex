import Block from '../../shared/lib/block/block';
import template from './chats.hbs?raw';
import { ChatLayout } from '../../features/chats';
import { chatStoreInstance } from '@/app/resources/store/chat.store';
import { authStore } from '@/app/resources/store/auth.store';
import { ChatApi } from '@/entities/chat/api';
import { mapChatsFromApi } from '@/entities/chat/utils/chat-mapper';
import { router } from '@/shared/lib/routing/router/router';

export class MessengerPage extends Block {
  constructor() {
    super('main', {
      className: 'messenger-page',
      ChatLayoutComponent: new ChatLayout({
        chats: [],
        activeChat: undefined,
        onChatSelect: (chatId: string) => {
          this.handleChatSelect(chatId);
        },
        onSendMessage: (message: string) => {
          this.handleSendMessage(message);
        },
      }),
    });

    this.initializePage();
  }

  /**
   * Инициализировать страницу
   */
  private async initializePage(): Promise<void> {
    const isAuthenticated = authStore.getIsAuth();
    if (isAuthenticated) {
      await this.loadChats();
      this.setupStoreListeners();
    } else {
      router.go('/');
    }
  }

  /**
   * Загрузить чаты с сервера
   */
  private async loadChats(): Promise<void> {
    try {
      const chatsResponse = await ChatApi.getChats();
      const mappedChats = mapChatsFromApi(chatsResponse);
      chatStoreInstance.setChats(chatsResponse);
      this.updateChatLayout(mappedChats);
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        router.go('/');
        return;
      }
    }
  }

  /**
   * Настроить слушатели стора
   */
  private setupStoreListeners(): void {
    chatStoreInstance.on('updated', (prevState, nextState) => {
      if (prevState.chats !== nextState.chats || prevState.messages !== nextState.messages) {
        this.updateChatLayout();
      }
    });
  }

  /**
   * Обновить ChatLayout с новыми данными
   */
  private updateChatLayout(mappedChats?: any[]): void {
    const state = chatStoreInstance.getState();
    const currentChat = chatStoreInstance.getCurrentChat();

    const chats = mappedChats || mapChatsFromApi(state.chats);
    const activeChat = currentChat ? mapChatsFromApi([currentChat])[0] : undefined;

    const chatLayoutComponent = this.children.ChatLayoutComponent as ChatLayout;
    if (chatLayoutComponent && typeof chatLayoutComponent.updateChats === 'function') {
      chatLayoutComponent.updateChats(chats);

      if (activeChat) {
        chatLayoutComponent.setProps({
          activeChat,
        });
      }
    }
  }

  private handleChatSelect = (chatId: string): void => {
    const state = chatStoreInstance.getState();
    const selectedChat = state.chats.find(chat => chat.id.toString() === chatId);

    if (selectedChat) {
      const mappedChat = mapChatsFromApi([selectedChat])[0];
      const chatLayoutComponent = this.children.ChatLayoutComponent as ChatLayout;
      if (chatLayoutComponent && typeof chatLayoutComponent.setProps === 'function') {
        chatLayoutComponent.setProps({
          activeChat: mappedChat,
        });
      }
    }
  };

  private handleSendMessage = (_message: string): void => {
    // функция-заглушка
  };

  render(): string {
    return template;
  }
}

export default MessengerPage;
