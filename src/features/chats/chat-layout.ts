import Block from '../../shared/lib/block/block';
import template from './chat-layout.hbs?raw';
import { IProps, IChat } from './types/types';
import ChatSideBar from './ui/chat-sidebar/chat-sidebar';
import ChatHeader from './ui/chat-header/chat-header';
import ChatDialog from './ui/chat-dialog/chat-dialog';
import ChatTextArea from './ui/chat-textarea/chat-textarea';
import ChatDialogEmpty from './ui/chat-dialog-empty/chat-dialog-empty';

class ChatLayout extends Block {
  private sidebarComponent!: ChatSideBar;

  constructor(props: IProps) {
    const sidebarComponent = new ChatSideBar({
      chats: props.chats || [],
      selectedChatId: props.activeChat?.id,
      onChatSelect: (chatId: string) => {
        console.log('ChatLayout onChatSelect triggered for chatId:', chatId);
        this.handleChatSelect(chatId);
      },
      onProfileClick: () => {
        console.log('Переход в профиль');
      },
      onSearch: (query: string) => {
        console.log('Поиск:', query);
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
              console.log('Открыть меню чата');
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
              console.log('Прикрепить файл');
            },
          })
        : null,
      ChatDialogEmptyComponent: !props.activeChat ? new ChatDialogEmpty() : null,
    });

    this.sidebarComponent = sidebarComponent;
  }

  private handleChatSelect = (chatId: string): void => {
    console.log('ChatLayout handleChatSelect called for chatId:', chatId);
    console.log(
      'Available chats:',
      this.props.chats?.map((c: IChat) => c.id),
    );
    const selectedChat = this.props.chats?.find((chat: IChat) => chat.id === chatId);
    console.log('Selected chat found:', selectedChat ? selectedChat.profileName : 'not found');

    console.log('Updating sidebar with selected chatId:', chatId);
    this.sidebarComponent.updateSelectedChat(chatId);

    console.log('Setting new props with selected chat:', selectedChat?.profileName);

    const newChildren: Record<string, Block | null> = {};

    if (selectedChat) {
      newChildren.ChatHeaderComponent = new ChatHeader({
        profileName: selectedChat.profileName,
        profileAvatar: selectedChat.avatar,
        onMenuClick: () => {
          console.log('Открыть меню чата');
        },
      });

      newChildren.ChatDialogComponent = new ChatDialog({
        createDate: 'Сегодня',
        messages: selectedChat.messages,
      });

      newChildren.ChatTextAreaComponent = new ChatTextArea({
        onSendMessage: (message: string) => {
          this.handleSendMessage(message);
        },
        onAttachFile: () => {
          console.log('Прикрепить файл');
        },
      });

      newChildren.ChatDialogEmptyComponent = null;
    } else {
      newChildren.ChatHeaderComponent = null;
      newChildren.ChatDialogComponent = null;
      newChildren.ChatTextAreaComponent = null;
      newChildren.ChatDialogEmptyComponent = new ChatDialogEmpty();
    }

    Object.entries(newChildren).forEach(([key, component]) => {
      if (component) {
        this.children[key] = component;
      } else {
        delete this.children[key];
      }
    });

    this.setProps({
      activeChat: selectedChat,
      ...newChildren,
    });

    this._render();
    console.log('Props and children updated successfully');

    if (this.props.onChatSelect) {
      this.props.onChatSelect(chatId);
    }
  };

  private handleSendMessage = (message: string): void => {
    if (this.props.onSendMessage) {
      this.props.onSendMessage(message);
    }
  };

  render(): string {
    return template;
  }
}

export default ChatLayout;
