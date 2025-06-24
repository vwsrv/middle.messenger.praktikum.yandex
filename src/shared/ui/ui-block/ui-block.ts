import Block from '../../lib/block/block';
import { TEvents } from '../../lib/block/interfaces';
import template from './ui-block.hbs?raw';
import { IProps } from './types/types';

class UiBlock extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: `block block_${props.type}`,
      events: {
        click: (e: Event) => {
          if (props.onClick) {
            props.onClick(e);
          }
        },
      } as TEvents,
    });
  }

  render(): string {
    return template;
  }
}

export default UiBlock;
