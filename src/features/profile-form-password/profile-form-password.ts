import Block from '../../shared/lib/block/block';
import { IBlockProps, TEvents } from '@/shared/lib/block/interfaces';
import ProfileInput from '../../shared/ui/profile-input/profile-input';
import ProfileAvatar from '../../shared/ui/profile-avatar/profile-avatar';
import Button from '../../shared/ui/button/button';
import Modal from '../../shared/ui/modal/modal';
import template from './profile-form-password.hbs?raw';
import { ChangeAvatarForm } from '@/features';
import { validateField } from '@/shared/lib/validation';
import { router } from '@/shared/lib/routing/router/router.ts';
import UserApi from '@/entities/user/api/user.api';
import { authStore } from '@/app/resources/store/auth.store';

interface IProps extends IBlockProps {
  onBack?: () => void;
  oldPassword: string;
  password: string;
  passwordConfirm: string;
  disabled?: boolean;
  profileName?: string;
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
          router.back();
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

      OldPassword: new ProfileInput({
        type: 'password',
        name: 'oldPassword',
        placeholder: 'Старый пароль',
        value: INITIAL_STATE.oldPassword,
        onInput: value => {
          this.updateField('oldPassword', value);
        },
      }),

      NewPassword: new ProfileInput({
        type: 'password',
        name: 'newPassword',
        placeholder: 'Новый пароль',
        value: INITIAL_STATE.password,
        onInput: value => {
          this.updateField('password', value);
        },
      }),

      NewPasswordConfirm: new ProfileInput({
        type: 'password',
        name: 'confirmPassword',
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
    this.updateControlsState();
    this.loadUserData();
  }

  private updateField(field: keyof IProps, value: string): void {
    this.formState[field] = value;
    this.updateControlsState();
  }

  private isFormValid(): boolean {
    const hasAllFields = Object.values(this.formState).every(value => value && value.length > 0);

    if (!hasAllFields) {
      return false;
    }

    const passwordError = validateField('password', this.formState.password);
    const passwordsMatch = this.formState.password === this.formState.passwordConfirm;
    const oldPasswordValid = this.formState.oldPassword.length >= 3;

    return !passwordError && passwordsMatch && oldPasswordValid;
  }

  private updateControlsState(): void {
    const isValid = this.isFormValid();

    const buttonChild = this.children.SubmitButton as Button;
    if (buttonChild && buttonChild.setProps) {
      buttonChild.setProps({ disabled: !isValid });
    }
  }

  private handleAvatarClick(): void {
    this.avatarModal.setProps({ isOpen: true, status: 'opened' });
  }

  private async loadUserData(): Promise<void> {
    const user = authStore.getUser();
    if (!user) {
      await authStore.loadUser();
    }
    this.updateFormWithUserData();
  }

  private updateFormWithUserData(): void {
    const user = authStore.getUser();
    if (!user) return;

    this.setProps({
      profileName: user.display_name,
    });
  }

  private setLoading(isLoading: boolean): void {
    const button = this.children.SubmitButton as Button;
    button.setProps({
      disabled: isLoading,
      label: isLoading ? 'Сохранение...' : 'Сохранить',
    });
  }

  private async handleSubmit(): Promise<void> {
    const isPasswordMatch = this.formState.password === this.formState.passwordConfirm;

    if (!isPasswordMatch) {
      const confirmInput = this.children.NewPasswordConfirm as ProfileInput;
      if (confirmInput) {
        confirmInput.setProps({ error: 'Пароли не совпадают' });
      }
      return;
    }

    try {
      this.setLoading(true);

      await UserApi.updatePassword({
        oldPassword: this.formState.oldPassword,
        newPassword: this.formState.password,
      });

      console.log('Пароль успешно изменен');

      this.formState.oldPassword = '';
      this.formState.password = '';
      this.formState.passwordConfirm = '';

      this.updateInputValues();
      this.updateControlsState();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка смены пароля';
      const oldPasswordInput = this.children.OldPassword as ProfileInput;
      if (oldPasswordInput) {
        oldPasswordInput.setProps({ error: errorMessage });
      }
      console.error('Ошибка смены пароля:', errorMessage);
    } finally {
      this.setLoading(false);
    }
  }

  private updateInputValues(): void {
    const oldPasswordInput = this.children.OldPassword as ProfileInput;
    const newPasswordInput = this.children.NewPassword as ProfileInput;
    const confirmInput = this.children.NewPasswordConfirm as ProfileInput;

    if (oldPasswordInput) oldPasswordInput.setProps({ value: this.formState.oldPassword });
    if (newPasswordInput) newPasswordInput.setProps({ value: this.formState.password });
    if (confirmInput) confirmInput.setProps({ value: this.formState.passwordConfirm });
  }

  render(): string {
    return template;
  }
}

export default ProfileFormPassword;
