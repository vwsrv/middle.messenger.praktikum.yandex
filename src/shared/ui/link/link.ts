import Block from '../../lib/block/block';
import { IBlockProps } from '../../lib/block/interfaces';

import template from './link.hbs?raw';
import { TLink } from './types';

interface IProps extends IBlockProps {
  name: string;
  border: boolean;
  theme: TLink;
  path: URL;
}

class Link extends Block {
  constructor(props: IProps) {
    super('a', {
      ...props,
      className: `link link_${props.theme} link_border ${!props.border ? 'link_no-border' : ''}`,
      href: props.path.toString(),
      events: {
        click: (...args: unknown[]) => {
          const e = args[0] as MouseEvent;
          e.preventDefault();
          window.location.href = props.path.toString();
        },
      },
    });
  }

  public render(): string {
    return template;
  }
}

export default Link;
