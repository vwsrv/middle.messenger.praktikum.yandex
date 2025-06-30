import Block from '@/shared/lib/block/block';
import Link from '@/shared/ui/link/link';
import { router } from '@/shared/lib/routing/router/router';
import template from './error-message.hbs?raw';
import { IBlockProps } from '@/shared/lib/block/interfaces';

interface IProps extends IBlockProps {
  errorCode: string;
  errorMessage: string;
  src: string;
}

class ErrorMessage extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'error',
      BackLink: new Link({
        name: 'Назад к чатам',
        theme: 'primary',
        border: false,
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          router.back();
        },
      }),
    });
  }

  render(): string {
    return template;
  }
}

export default ErrorMessage;
