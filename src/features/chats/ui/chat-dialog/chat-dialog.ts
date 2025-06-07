import Block from '../../../../shared/lib/block/block';
import template from './chat-dialog.hbs?raw';
import { IProps } from './types/types';
import ChatMessageItem from '../chat-message-item/chat-message-item';

class ChatDialog extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'chat__dialog',
      MessageItems: props.messages.map(
        message =>
          new ChatMessageItem({
            type: message.type,
            status: message.status,
            time: message.time,
            isSelected: message.active,
            text: message.text,
          }),
      ),
    });
  }

  render(): string {
    return template;
  }
}

export default ChatDialog;
