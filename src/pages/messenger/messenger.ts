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
      console.warn('Пользователь не авторизован, перенаправление на страницу входа');
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

      // Сохранить в стор
      chatStoreInstance.setChats(chatsResponse);

      // Обновить компонент с преобразованными данными
      this.updateChatLayout(mappedChats);
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);

      // Если ошибка 401, перенаправить на страницу входа
      if (error instanceof Error && error.message.includes('401')) {
        console.warn('Пользователь не авторизован, перенаправление на страницу входа');
        router.go('/');
        return;
      }

      // Показать ошибку пользователю
      console.error('Не удалось загрузить чаты:', error);
    }
  }

  /**
   * Настроить слушатели стора
   */
  private setupStoreListeners(): void {
    // Слушать изменения в сторе
    chatStoreInstance.on('updated', (prevState, nextState) => {
      // Обновить UI при изменении чатов или сообщений
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

    // Если переданы преобразованные чаты, используем их
    const chats = mappedChats || mapChatsFromApi(state.chats);
    const activeChat = currentChat ? mapChatsFromApi([currentChat])[0] : undefined;

    const chatLayoutComponent = this.children.ChatLayoutComponent as ChatLayout;
    if (chatLayoutComponent && typeof chatLayoutComponent.updateChats === 'function') {
      console.log('Обновляем чаты в ChatLayout:', chats);
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

  private handleSendMessage = (message: string): void => {
    console.log('Отправка сообщения:', message);
    // Сообщение отправляется через WebSocket в ChatLayout
  };

  render(): string {
    return template;
  }
}

export default MessengerPage;
