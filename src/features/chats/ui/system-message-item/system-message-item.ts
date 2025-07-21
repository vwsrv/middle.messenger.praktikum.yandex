import Block from '../../../../shared/lib/block/block';
import template from './system-message-item.hbs?raw';
import { IProps } from './types/types';

class SystemMessageItem extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'system-message',
    });
  }

  public getId(): string | undefined {
    return this.props.id;
  }

  render(): string {
    return template;
  }
}

export default SystemMessageItem;
