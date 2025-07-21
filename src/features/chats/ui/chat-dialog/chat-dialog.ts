import Block from '../../../../shared/lib/block/block';
import template from './chat-dialog.hbs?raw';
import { IProps, ISystemMessage } from './types/types';
import ChatMessageItem from '../chat-message-item/chat-message-item';
import SystemMessageItem from '../system-message-item/system-message-item';

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

    const systemMessageItems = (props.systemMessages || []).map(
      systemMessage =>
        new SystemMessageItem({
          id: systemMessage.id,
          type: systemMessage.type,
          content: systemMessage.content,
        }),
    );

    super('div', {
      ...props,
      className: 'chat__dialog',
      MessageItems: messageItems,
      SystemMessages: systemMessageItems,
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

  private createSystemMessageItems(systemMessages: ISystemMessage[]): SystemMessageItem[] {
    return systemMessages.map(
      systemMessage =>
        new SystemMessageItem({
          id: systemMessage.id,
          type: systemMessage.type,
          content: systemMessage.content,
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

  public updateSystemMessages(systemMessages: ISystemMessage[]): void {
    // Проверяем, есть ли изменения в системных сообщениях
    const currentSystemMessages = this.props.systemMessages || [];
    const hasChanges =
      currentSystemMessages.length !== systemMessages.length ||
      currentSystemMessages.some(
        (message: ISystemMessage, index: number) => message.id !== systemMessages[index]?.id,
      );

    if (!hasChanges) {
      return;
    }

    const newSystemMessageItems = this.createSystemMessageItems(systemMessages);
    this.children.SystemMessages = newSystemMessageItems;
    this.setProps({ systemMessages });
    this._render();
  }

  public addSystemMessage(systemMessage: ISystemMessage): void {
    const currentSystemMessages = this.props.systemMessages || [];
    const updatedSystemMessages = [...currentSystemMessages, systemMessage];
    this.updateSystemMessages(updatedSystemMessages);
  }

  render(): string {
    return template;
  }
}

export default ChatDialog;
