import Block from '../../../../shared/lib/block/block';
import template from './chat-dialog-empty.hbs?raw';
import { IProps } from './types/types';

class ChatDialogEmpty extends Block {
  constructor(props: IProps = {}) {
    super('div', {
      ...props,
      className: 'chat-empty',
    });
  }

  render(): string {
    return template;
  }
}

export default ChatDialogEmpty;
