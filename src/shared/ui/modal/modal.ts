import Block from '../../lib/block/block';
import { IBlockProps, TEvents } from '../../lib/block/interfaces';
import template from './modal.hbs?raw';
import { TModal } from './types';

interface IProps extends IBlockProps {
  isOpen: boolean;
  content: Block;
  onClose: () => void;
  onSubmit?: () => void;
  status: TModal;
  children?: Record<string, Block | Block[]>;
}

class Modal extends Block {
  constructor(props: IProps) {
    const { children, ...restProps } = props;

    super('div', {
      ...restProps,
      children,
      className: `modal modal__${props.status}`,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (
            target.classList.contains('modal__overlay') ||
            target.classList.contains('modal__close-btn')
          ) {
            props.onClose();
          }
        },
      } as TEvents,
    });
  }

  componentDidUpdate(oldProps: IProps, newProps: IProps): boolean {
    if (oldProps.status !== newProps.status && this.element) {
      this.element.className = `modal modal__${newProps.status}`;
    }
    return true;
  }

  render() {
    return template;
  }
}

export default Modal;
