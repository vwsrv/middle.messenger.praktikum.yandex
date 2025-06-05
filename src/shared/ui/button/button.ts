import Block from '../../lib/block/block';
import { IBlockProps, TEvents } from '../../lib/block/interfaces';

import template from './button.hbs?raw';
import { TButton } from './types';

export interface IProps extends IBlockProps {
  label?: string;
  type?: 'button' | 'submit' | 'reset';
  theme?: TButton;
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
}

class Button extends Block {
  constructor(props: IProps) {
    super('button', {
      ...props,
      className: `button button__${props.theme || 'default'}`,
      events: {
        click: props.onClick,
      } as TEvents,
    });
  }

  public render(): string {
    return template;
  }
}

export default Button;
