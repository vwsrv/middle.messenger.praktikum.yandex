import ProfileFormEdit from '../../../features/profile-form-edit/profile-form-edit.ts';
import Block from '../../../shared/lib/block/block.ts';
import template from './profile.hbs?raw';
import { IBlockProps } from '@/shared/lib/block/interfaces';

interface IProps extends IBlockProps {
  first_name?: string;
  second_name?: string;
}

export class Settings extends Block {
  constructor(props: IProps = {}) {
    super('main', {
      ...props,
      className: 'profile-page',
      ProfileEditForm: new ProfileFormEdit({
        email: '',
        login: '',
        first_name: props.first_name!,
        second_name: props.second_name!,
        phone: '',
        password: '',
        password_confirm: '',
        profileName: `${props.first_name} ${props.second_name!}`,
      }),
    });
  }

  render(): string {
    return template;
  }
}
