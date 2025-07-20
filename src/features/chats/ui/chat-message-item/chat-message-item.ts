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

  public getId(): string | undefined {
    return this.props.id;
  }

  render(): string {
    return template;
  }
}

export default ChatMessageItem;
