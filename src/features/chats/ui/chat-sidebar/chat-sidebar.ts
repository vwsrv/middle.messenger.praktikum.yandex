import Block from '../../../../shared/lib/block/block';
import template from './chat-sidebar.hbs?raw';
import { IProps } from './types/types';
import Button from '../../../../shared/ui/button/button';
import CombinedInput from '../../../../shared/ui/combined-input/combined-input';
import ChatPreview from '../../../../shared/ui/chat-preview/chat-preview';
import { router } from '@/shared/lib/routing/router/router.ts';
import debounce from '@/shared/utils/debounce';

class ChatSidebar extends Block {
  private debouncedSearch: ReturnType<typeof debounce>;

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
          onChatSelect: props.onChatSelect,
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
      CreateChatButton: new Button({
        type: 'button',
        theme: 'create-message',
        label: '',
        onClick: () => {
          if (props.onCreateChat) {
            props.onCreateChat();
          }
        },
      }),
      SearchInput: new CombinedInput({
        className: 'input_search',
        type: 'text',
        name: 'search',
        placeholder: 'Поиск',
        value: '',
        onInput: (value: string) => {
          this.debouncedSearch(value);
        },
      }),
      ChatPreviews: chatPreviews,
    });

    this.debouncedSearch = debounce(
      (value: string) => {
        if (props.onSearch) {
          props.onSearch(value);
        }
      },
      { delay: 300 },
    );
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
          onChatSelect: props.onChatSelect,
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
      onCreateChat: this.props.onCreateChat,
    });

    this.setProps({
      selectedChatId,
      ChatPreviews: newChatPreviews,
    });
  }

  public getSelectedChatId(): string | undefined {
    return this.props.selectedChatId;
  }

  public updateProps(newProps: Partial<IProps>): void {
    if (newProps.chats) {
      this.children.ChatPreviews = newProps.chats.map(
        chat =>
          new ChatPreview({
            isSelected: chat.id === newProps.selectedChatId,
            chatId: chat.id,
            avatarSrc: chat.avatar,
            avatarName: chat.profileName,
            name: chat.profileName,
            time: chat.sentTime,
            message: chat.messageText,
            count: chat.messageCount,
            onChatSelect: this.props.onChatSelect,
          }),
      );
    }

    this.setProps(newProps);

    this._render();
  }

  render(): string {
    return template;
  }
}

export default ChatSidebar;
