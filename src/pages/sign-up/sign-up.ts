import SignUpForm from '@/features/auth/register/sign-up-form/sign-up-form';
import Block from '../../shared/lib/block/block';
import template from './sign-up.hbs?raw';

export class SignUpPage extends Block {
  constructor() {
    super('main', {
      className: 'sign-up-page',
      SignUpForm: new SignUpForm({
        email: '',
        first_name: '',
        login: '',
        password: '',
        password_confirm: '',
        phone: '',
        second_name: '',
        type: 'sign-up',
      }),
    });
  }

  render(): string {
    return template;
  }
}
