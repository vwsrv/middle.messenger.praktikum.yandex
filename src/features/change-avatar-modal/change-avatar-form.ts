import Block from '../../shared/lib/block/block';
import { IBlockProps, TEvents } from '@/shared/lib/block/interfaces';
import Button from '../../shared/ui/button/button';
import template from './change-avatar-form.hbs?raw';
import UserApi from '@/entities/user/api/user.api';
import { authStore } from '@/app/resources/store/auth.store';

interface IProps extends IBlockProps {
  onSave?: () => void;
  onCancel?: () => void;
  onAvatarUpdated?: () => void;
  events?: TEvents;
}

export class ChangeAvatarForm extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'change-avatar-form',
      SaveButton: new Button({
        label: 'Сохранить',
        type: 'button',
        theme: 'primary',
        disabled: true,
        onClick: async () => {
          const fileInput = document.querySelector(
            '.change-avatar-form__input',
          ) as HTMLInputElement;
          if (fileInput?.files?.length) {
            const success = await this.handleAvatarUpload(fileInput.files[0]);
            if (success) {
              props.onSave?.();
            }
          }
        },
      }),
      CancelButton: new Button({
        label: 'Отменить',
        type: 'button',
        theme: 'primary',
        onClick: () => {
          props.onCancel?.();
        },
      }),
      events: {
        change: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.type === 'file') {
            const saveButton = this.children.SaveButton as Button;
            const isFileSelected = Boolean(target.files?.length);
            saveButton.setProps({ disabled: !isFileSelected });
          }
        },
      } as TEvents,
    });
  }

  private async handleAvatarUpload(file: File): Promise<boolean> {
    try {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

      if (!allowedTypes.includes(file.type)) {
        console.error('Неподдерживаемый тип файла. Разрешены только JPEG, JPG, PNG, GIF');
        return false;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      await UserApi.updateAvatar(formData);

      const updatedUser = await UserApi.getUser();
      authStore.updateUser(updatedUser);

      this.props.onAvatarUpdated?.();
      return true;
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      return false;
    }
  }

  render() {
    return template;
  }
}
