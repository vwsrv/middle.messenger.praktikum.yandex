import Block from '../../lib/block/block';
import { TEvents } from '../../lib/block/interfaces';
import template from './dropdown-item.hbs?raw';
import { IProps } from './types/types';

class DropdownItem extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'dropdown__item',
      events: {
        click: () => {
          if (props.onClick) {
            props.onClick();
          }
        },
      } as TEvents,
    });
  }

  render(): string {
    return template;
  }
}

export default DropdownItem;
