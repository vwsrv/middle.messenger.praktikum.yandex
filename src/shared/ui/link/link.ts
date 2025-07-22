import Block from '../../lib/block/block';
import { IBlockProps, TEvents } from '../../lib/block/interfaces';
import template from './link.hbs?raw';
import { TLink } from './types';
import { router } from '@/shared/lib/routing/router/router.ts';

interface IProps extends IBlockProps {
  name: string;
  theme: TLink;
  path?: string;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
}

class Link extends Block {
  constructor(props: IProps) {
    const disabledClass = props.disabled ? 'link_disabled' : '';
    const borderClass = !props.border ? 'link_no-border' : '';
    const classes = [
      'link',
      `link_${props.theme}`,
      'link_border',
      borderClass,
      disabledClass,
    ].filter(Boolean);

    super('a', {
      ...props,
      className: classes.join(' '),
      href: props.disabled ? undefined : props.path || '#',
      events: {
        click: (e: MouseEvent) => {
          if (this.props.disabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }

          e.preventDefault();

          if (this.props.path) {
            router.go(this.props.path);
          }

          if (this.props.onClick) {
            this.props.onClick(e);
          }
        },
      } as TEvents,
    });
  }

  public render(): string {
    return template;
  }

  componentDidUpdate(oldProps: IProps, newProps: IProps): boolean {
    if (
      oldProps.disabled !== newProps.disabled ||
      oldProps.theme !== newProps.theme ||
      oldProps.name !== newProps.name
    ) {
      const disabledClass = newProps.disabled ? 'link_disabled' : '';
      const borderClass = !newProps.border ? 'link_no-border' : '';
      const classes = [
        'link',
        `link_${newProps.theme}`,
        'link_border',
        borderClass,
        disabledClass,
      ].filter(Boolean);

      this.props.className = classes.join(' ');
      this.props.href = newProps.disabled ? undefined : newProps.path || '#';
    }

    return (
      oldProps.disabled !== newProps.disabled ||
      oldProps.name !== newProps.name ||
      oldProps.theme !== newProps.theme
    );
  }
}

export default Link;
