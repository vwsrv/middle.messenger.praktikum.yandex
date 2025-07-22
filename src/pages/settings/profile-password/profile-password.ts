import ProfileFormPassword from '../../../features/profile-form-password/profile-form-password.ts';
import Block from '../../../shared/lib/block/block.ts';
import template from './profile-password.hbs?raw';

interface IProps {}

export class SettingsPassword extends Block {
  constructor(props: IProps) {
    super('main', {
      ...props,
      className: 'profile-password',
      PasswordChangeForm: new ProfileFormPassword({
        oldPassword: '',
        password: '',
        passwordConfirm: '',
      }),
    });
  }

  render(): string {
    return template;
  }
}
