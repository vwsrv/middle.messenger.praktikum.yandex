// src/pages/sign-up/sign-up.ts
import Block from '../../shared/lib/block/block';
import template from './sign-up.hbs?raw';
import Register from '@/features/auth/register/register.ts';
import { IUserDataResponse } from '@/entities/user/models/interfaces/user-data';
import { authStore } from '@/app/resources/store/auth.store.ts';
import { router } from '@/shared/lib/routing/router/router';

export class SignUpPage extends Block {
  constructor() {
    super('main', {
      className: 'sign-up-page',
      SignUpForm: new Register({
        email: '',
        first_name: '',
        login: '',
        password: '',
        password_confirm: '',
        phone: '',
        second_name: '',
        type: 'sign-up',
        onSuccess: (userData: IUserDataResponse) => {
          authStore.setUser(userData);
          router.go('/messenger');
        },
      }),
    });
  }

  render(): string {
    return template;
  }
}
