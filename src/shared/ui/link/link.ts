import Block from '../../lib/block/block';
import { IBlockProps } from '../../lib/block/interfaces';
import template from './link.hbs?raw';
import { TLink } from './types';
import { TEvents } from '../../lib/block/interfaces';

interface IProps extends IBlockProps {
  name: string;
  theme: TLink;
  path?: URL;
  onClick?: (e: MouseEvent) => void;
}

class Link extends Block {
  constructor(props: IProps) {
    super('a', {
      ...props,
      className: `link link_${props.theme} link_border ${!props.border ? 'link_no-border' : ''}`,
      href: props.path?.toString() || '#',
      path: props.path,
      events: {
        click: (e: MouseEvent) => {
          e.preventDefault(); // Отменяем стандартное поведение
          if (props.path) {
            // Вариант 1: Через window.location
            window.location.href = props.path.toString();

            // Или вариант 2: Через роутер (если есть)
            // router.go(props.path.pathname);
          }
          props.onClick?.(e); // Дополнительный кастомный обработчик
        },
      } as TEvents,
    });
  }

  public render(): string {
    return template;
  }
}

export default Link;
