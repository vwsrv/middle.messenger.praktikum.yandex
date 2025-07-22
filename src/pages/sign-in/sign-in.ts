import Login from '@/features/auth/login/login.ts';
import Block from '../../shared/lib/block/block.ts';
import template from './sign-in.hbs?raw';
import { authStore } from '@/app/resources/store/auth.store.ts';
import { routerProvider } from '@/app/providers/router/router-provider.ts';
import { IUserDataResponse } from '@/entities/user/models/interfaces/user-data';

export class SignInPage extends Block {
  constructor() {
    super('main', {
      className: 'sign-in-page',
      SignInForm: new Login({
        login: '',
        password: '',
        type: 'sign-in',
        onSuccess: (userData: IUserDataResponse) => {
          authStore.setUser(userData);
          routerProvider.getInstance().go('/messenger');
        },
      }),
      ErrorComponent: null,
    });
  }

  render(): string {
    return template;
  }
}

export default SignInPage;
