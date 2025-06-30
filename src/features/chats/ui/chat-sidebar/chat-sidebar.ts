import Block from '../../../../shared/lib/block/block';
import template from './chat-sidebar.hbs?raw';
import { IProps } from './types/types';
import Button from '../../../../shared/ui/button/button';
import CombinedInput from '../../../../shared/ui/combined-input/combined-input';
import ChatPreview from '../../../../shared/ui/chat-preview/chat-preview';
import { router } from '@/shared/lib/routing/router/router.ts';

class ChatSidebar extends Block {
  constructor(props: IProps) {
    const chatPreviews = props.chats.map(
      chat =>
        new ChatPreview({
          isSelected: chat.id === props.selectedChatId,
          chatId: chat.id,
          avatarSrc: chat.avatar,
          avatarName: chat.profileName,
          name: chat.profileName,
          time: chat.sentTime,
          message: chat.messageText,
          count: chat.messageCount,
          onClick: (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          },
        }),
    );

    super('aside', {
      ...props,
      className: 'chat-sidebar',
      selectedChatId: props.selectedChatId || null,
      ProfileButton: new Button({
        type: 'button',
        theme: 'arrow-unstyled',
        label: 'Профиль',
        onClick: () => {
          router.go('/settings');
        },
      }),
      SearchInput: new CombinedInput({
        className: 'input_search',
        type: 'text',
        name: 'search',
        placeholder: 'Поиск',
        value: '',
        onInput: (value: string) => {
          if (props.onSearch) {
            props.onSearch(value);
          }
        },
      }),
      ChatPreviews: chatPreviews,
    });
  }

  private createChatPreviews(props: IProps): ChatPreview[] {
    return props.chats.map(
      chat =>
        new ChatPreview({
          isSelected: chat.id === props.selectedChatId,
          chatId: chat.id,
          avatarSrc: chat.avatar,
          avatarName: chat.profileName,
          name: chat.profileName,
          time: chat.sentTime,
          message: chat.messageText,
          count: chat.messageCount,
          onClick: (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
          },
        }),
    );
  }

  public updateSelectedChat(selectedChatId: string): void {
    const newChatPreviews = this.createChatPreviews({
      chats: this.props.chats,
      selectedChatId,
      onChatSelect: this.props.onChatSelect,
      onProfileClick: this.props.onProfileClick,
      onSearch: this.props.onSearch,
    });

    this.setProps({
      selectedChatId,
      ChatPreviews: newChatPreviews,
    });
  }

  render(): string {
    return template;
  }
}

export default ChatSidebar;
