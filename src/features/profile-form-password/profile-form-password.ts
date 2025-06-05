import Block from '../../shared/lib/block/block';
import { IBlockProps, TEvents } from '../../shared/lib/block/interfaces';
import ProfileInput from '../../shared/ui/profile-input/profile-input';
import ProfileAvatar from '../../shared/ui/profile-avatar/profile-avatar';
import Button from '../../shared/ui/button/button';
import Modal from '../../shared/ui/modal/modal';
import template from './profile-form-password.hbs?raw';
import { ChangeAvatarForm } from '../change-avatar-modal';

interface IProps extends IBlockProps {
  onBack?: () => void;
  oldPassword: string;
  password: string;
  passwordConfirm: string;
  disabled?: boolean;
}

class ProfileFormPassword extends Block {
  private readonly formState: IProps;
  private avatarModal: Modal;

  constructor(props: IProps) {
    const INITIAL_STATE: IProps = {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
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
      ChangeAvatarButton: new Button({
        label: 'Изменить',
        theme: 'primary',
        onClick: () => {
          this.handleAvatarClick();
        },
      }),
      AvatarModal: avatarModal,
      OldPassword: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Старый пароль',
        value: INITIAL_STATE.oldPassword,
        onInput: value => {
          this.updateField('oldPassword', value);
        },
      }),
      NewPassword: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Новый пароль',
        value: INITIAL_STATE.password,
        onInput: value => {
          this.updateField('password', value);
        },
      }),
      NewPasswordConfirm: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Повторите новый пароль',
        value: INITIAL_STATE.passwordConfirm,
        onInput: value => {
          this.updateField('passwordConfirm', value);
        },
      }),
      SubmitButton: new Button({
        type: 'submit',
        theme: 'primary',
        label: 'Сохранить',
        disabled: true,
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          this.handleSubmit();
        },
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

export default ProfileFormPassword;
