import Block from '@/shared/lib/block/block';
import template from './not-found.hbs?raw';
import ErrorMessage from '@/features/error-message/error-message';

export class NotFoundPage extends Block {
  constructor() {
    super('main', {
      className: 'not-found-error',
      ErrorMessage: new ErrorMessage({
        errorCode: '404',
        errorMessage: 'Не туда попали',
        src: '/images/404-ducks.png',
      }),
    });
  }

  render(): string {
    return template;
  }
}

export default NotFoundPage;
