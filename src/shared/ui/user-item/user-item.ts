import Block from '@/shared/lib/block/block';
import { TEvents } from '@/shared/lib/block/interfaces';
import template from './user-item.hbs?raw';
import { IProps } from '@/shared/ui';
import './style.css';

class UserItem extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'user-item',
      firstLetter: props.display_name.charAt(0).toUpperCase(),
      events: {
        click: () => {
          if (props.onClick) {
            props.onClick(props);
          }
        },
      } as TEvents,
    });
  }

  render(): string {
    return template;
  }
}

export default UserItem;
