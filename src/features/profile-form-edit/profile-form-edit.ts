import Block from '../../shared/lib/block/block.ts';
import { IBlockProps } from '../../shared/lib/block/interfaces';
import Link from '../../shared/ui/link/link.ts';
import ProfileInput from '../../shared/ui/profile-input/profile-input.ts';
import template from './profile-form-edit.hbs?raw';
import ProfileAvatar from '../../shared/ui/profile-avatar/profile-avatar.ts';
import { ChangeAvatarForm } from '../change-avatar-modal';
import Modal from '../../shared/ui/modal/modal.ts';
import Button from '../../shared/ui/button/button.ts';
import { TEvents } from '../../shared/lib/block/interfaces';

interface IProps extends IBlockProps {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  profileName: string;
  disabled?: boolean;
}

class ProfileFormEdit extends Block {
  private readonly formState: IProps;
  private avatarModal: Modal;

  constructor(props: IProps) {
    const INITIAL_STATE: IProps = {
      email: '',
      login: '',
      first_name: 'Иван',
      second_name: 'Иванов',
      phone: '',
      profileName: `${props.first_name} ${props.second_name}`,
    };

    const changeAvatarForm = new ChangeAvatarForm({
      onSave: () => {
        avatarModal.setProps({ isOpen: false, status: 'closed' });
      },
      onCancel: () => {
        avatarModal.setProps({ isOpen: false, status: 'closed' });
      },
    });

    const avatarModal = new Modal({
      isOpen: false,
      status: 'closed',
      title: 'Загрузите файл',
      type: 'avatar',
      content: changeAvatarForm,
      onClose: () => {
        avatarModal.setProps({ isOpen: false, status: 'closed' });
      },
    });

    super('div', {
      ...props,
      formState: INITIAL_STATE,
      className: 'profile',
      BackButton: new Button({
        theme: 'arrow-left',
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          props.onBack?.();
        },
      }),

      ProfileAvatar: new ProfileAvatar({
        type: 'large',
        name: 'profileAvatar',
        url: 'https://via.placeholder.com/150',
        onClick: () => {
          this.handleAvatarClick();
        },
      }),

      AvatarModal: avatarModal,

      EmailInput: new ProfileInput({
        type: 'tel',
        name: 'email',
        placeholder: 'Почта',
        value: INITIAL_STATE.email,
        onInput: value => {
          this.updateField('email', value);
        },
      }),

      LoginInput: new ProfileInput({
        type: 'text',
        name: 'login',
        placeholder: 'Логин',
        value: INITIAL_STATE.login,
        onInput: value => {
          this.updateField('password', value);
        },
      }),

      NameInput: new ProfileInput({
        type: 'text',
        name: 'Имя',
        placeholder: 'Имя',
        value: INITIAL_STATE.passwordConfirm,
        onInput: value => {
          this.updateField('first_name', value);
        },
      }),

      SecondNameInput: new ProfileInput({
        type: 'text',
        name: 'second_name',
        placeholder: 'Фамилия',
        value: INITIAL_STATE.second_name,
        onInput: value => {
          this.updateField('second_name', value);
        },
      }),

      PhoneInput: new ProfileInput({
        type: 'tel',
        name: 'phone',
        placeholder: 'Телефон',
        value: INITIAL_STATE.phone,
        onInput: value => {
          this.updateField('phone', value);
        },
      }),

      ConfirmLink: new Link({
        name: 'Изменить данные',
        border: false,
        theme: 'primary',
        onClick: (e: MouseEvent) => {
          console.log('Изменить данные');
          e.preventDefault();
          this.handleSubmit();
        },
      }),

      PasswordEditLink: new Link({
        name: 'Изменить пароль',
        border: false,
        theme: 'primary',
        path: new URL('/profile-edit', window.location.origin),
      }),

      ExitLink: new Link({
        name: 'Выйти',
        border: false,
        theme: 'primary',
        path: new URL('/sign-out', window.location.origin),
      }),

      events: {
        submit: (e: Event) => {
          e.preventDefault();
          this.handleSubmit();
        },
      } as TEvents,
    });

    this.formState = INITIAL_STATE;
    this.avatarModal = avatarModal;
  }

  private updateField(field: keyof IProps, value: string): void {
    this.formState[field] = value;
    this.updateButtonState();
  }

  private isFormValid(): boolean {
    return Object.values(this.formState).every(value => value.length > 0);
  }

  private updateButtonState(): void {
    const isDisabled = !this.isFormValid();
    this.props.SubmitButton?.setProps?.({ disabled: isDisabled });
  }

  private handleAvatarClick(): void {
    console.log('Avatar clicked, current modal status:', this.avatarModal.element?.className);
    this.avatarModal.setProps({ isOpen: true, status: 'opened' });
    console.log('Modal status after update:', this.avatarModal.element?.className);
  }

  private handleSubmit(): void {
    console.log('Форма обработана без перезагрузки');
    const isPasswordMatch = this.formState.password === this.formState.passwordConfirm;

    if (!isPasswordMatch) {
      this.props.NewPasswordConfirm?.setProps?.({
        error: 'Пароли не совпадают',
      });
      return;
    }

    console.log('Форма отправлена:', this.formState);
  }

  render(): string {
    return template;
  }
}

export default ProfileFormEdit;
