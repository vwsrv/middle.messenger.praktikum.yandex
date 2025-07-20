import Block from '../../../../shared/lib/block/block';
import template from './chat-dialog.hbs?raw';
import { IProps } from './types/types';
import ChatMessageItem from '../chat-message-item/chat-message-item';

class ChatDialog extends Block {
  constructor(props: IProps) {
    const messageItems = props.messages.map(
      message =>
        new ChatMessageItem({
          id: message.id,
          type: message.type,
          status: message.status,
          time: message.time,
          isSelected: message.active,
          text: message.text,
        }),
    );

    super('div', {
      ...props,
      className: 'chat__dialog',
      MessageItems: messageItems,
    });
  }

  private createMessageItems(messages: any[]): ChatMessageItem[] {
    return messages.map(
      message =>
        new ChatMessageItem({
          id: message.id,
          type: message.type,
          status: message.status,
          time: message.time,
          isSelected: message.active,
          text: message.text,
        }),
    );
  }

  public updateMessages(messages: any[]): void {
    const currentMessageItems = this.children.MessageItems as ChatMessageItem[];
    const currentMessageIds = Array.isArray(currentMessageItems)
      ? currentMessageItems.map(item => item.getId())
      : [];
    const newMessageIds = messages.map(message => message.id);

    const hasChanges =
      currentMessageIds.length !== newMessageIds.length ||
      currentMessageIds.some(
        (id: string | undefined, index: number) => id !== newMessageIds[index],
      );

    if (!hasChanges) {
      return;
    }

    const newMessageItems = this.createMessageItems(messages);

    this.children.MessageItems = newMessageItems;

    this.setProps({ messages });

    this._render();
  }

  render(): string {
    return template;
  }
}

export default ChatDialog;
