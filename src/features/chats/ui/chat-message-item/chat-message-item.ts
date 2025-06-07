import Block from '../../../../shared/lib/block/block';
import template from './chat-message-item.hbs?raw';
import { IProps } from './types/types';

class ChatMessageItem extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: `message message__${props.type}`,
    });
  }

  render(): string {
    return template;
  }
}

export default ChatMessageItem;
