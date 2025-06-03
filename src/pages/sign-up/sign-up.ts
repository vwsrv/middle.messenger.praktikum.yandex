import SignUpForm from '../../features/sign-up-form/sign-up-form';
import Block from '../../shared/lib/block/block';

import template from './sign-up.hbs?raw';

interface IProps {}

export class SignUpPage extends Block {
  constructor(props: IProps) {
    super('main', {
      ...props,
      className: 'sign-up-page',
      signUpForm: new SignUpForm({
        type: 'sign-up',
      }),
    });
  }

  render(): string {
    return template;
  }
}
