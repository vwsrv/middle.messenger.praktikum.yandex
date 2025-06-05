import SignInForm from '../../features/sign-in-form/sign-in-form.ts';
import Block from '../../shared/lib/block/block.ts';
import template from './sign-in.hbs?raw';

export class SignInPage extends Block {
  constructor() {
    super('main', {
      className: 'sign-in-page',
      SignInForm: new SignInForm({ login: '', password: '', type: 'sign-in' }),
    });
  }

  render(): string {
    return template;
  }
}

export default SignInPage;
