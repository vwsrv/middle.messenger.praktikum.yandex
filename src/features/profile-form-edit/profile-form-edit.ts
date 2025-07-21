import Block from '../../shared/lib/block/block.ts';
import { IBlockProps, TEvents } from '@/shared/lib/block/interfaces';
import Link from '../../shared/ui/link/link.ts';
import ProfileInput from '../../shared/ui/profile-input/profile-input.ts';
import template from './profile-form-edit.hbs?raw';
import ProfileAvatar from '../../shared/ui/profile-avatar/profile-avatar.ts';
import { ChangeAvatarForm } from '@/features';
import Modal from '../../shared/ui/modal/modal.ts';
import Button from '../../shared/ui/button/button.ts';
import { validateField } from '@/shared/lib/validation';
import { router } from '@/shared/lib/routing/router/router.ts';
import UserApi from '@/entities/user/api/user.api.ts';
import { authStore } from '@/app/resources/store/auth.store';
import { RESOURCES_BASE_URL } from '@/shared/lib/api/constants';

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
      first_name: '',
      second_name: '',
      phone: '',
      profileName: ``,
    };

    const changeAvatarForm = new ChangeAvatarForm({
      onSave: () => {
        avatarModal.setProps({ isOpen: false, status: 'closed' });
      },
      onCancel: () => {
        avatarModal.setProps({ isOpen: false, status: 'closed' });
      },
      onAvatarUpdated: () => {
        this.updateAvatarDisplay();
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
        url: (() => {
          const user = authStore.getUser();
          const avatarUrl = user?.avatar
            ? `${RESOURCES_BASE_URL}${user.avatar}`
            : 'https://via.placeholder.com/150';
          console.log('Инициализация аватара:', avatarUrl);
          return avatarUrl;
        })(),
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
          this.updateField('login', value);
        },
      }),

      NameInput: new ProfileInput({
        type: 'text',
        name: 'Имя',
        placeholder: 'Имя',
        value: INITIAL_STATE.first_name,
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

      SubmitButton: new Button({
        label: 'Изменить данные',
        theme: 'link-style',
        disabled: true,
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          this.handleSubmit();
        },
      }),

      PasswordEditLink: new Link({
        name: 'Изменить пароль',
        border: false,
        theme: 'primary',
        path: '/settings/password',
      }),

      ExitLink: new Link({
        name: 'Выйти',
        border: false,
        theme: 'primary',
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          this.handleExitClick();
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
    this.bindFormEvents();
    this.loadUserData();
  }

  private bindFormEvents(): void {
    setTimeout(() => {
      const formElement = this.getContent()?.querySelector('form');
      if (formElement) {
        formElement.addEventListener('submit', (e: Event) => {
          e.preventDefault();
          this.handleSubmit();
        });
      }
    }, 0);
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

    const emailError = validateField('email', this.formState.email);
    const loginError = validateField('login', this.formState.login);
    const firstNameError = validateField('first_name', this.formState.first_name);
    const secondNameError = validateField('second_name', this.formState.second_name);
    const phoneError = validateField('phone', this.formState.phone);

    return !emailError && !loginError && !firstNameError && !secondNameError && !phoneError;
  }

  private updateControlsState(): void {
    const isValid = this.isFormValid();

    const buttonChild = this.children.SubmitButton as Button;
    if (buttonChild && buttonChild.setProps) {
      buttonChild.setProps({ disabled: !isValid });
    } else {
    }
  }

  private validateAllFields(): boolean {
    let isAllValid = true;

    Object.keys(this.formState).forEach(fieldName => {
      if (fieldName === 'profileName') return;

      const value = this.formState[fieldName as keyof IProps];
      const errorMessage = validateField(fieldName, value as string);

      if (errorMessage) {
        isAllValid = false;
      }
    });

    return isAllValid;
  }

  private handleAvatarClick(): void {
    this.avatarModal.setProps({ isOpen: true, status: 'opened' });
  }

  private updateAvatarDisplay(): void {
    const user = authStore.getUser();
    const profileAvatar = this.children.ProfileAvatar as ProfileAvatar;
    if (profileAvatar && user?.avatar) {
      const avatarUrl = `${RESOURCES_BASE_URL}${user.avatar}?t=${Date.now()}`;
      console.log('Обновление аватара:', avatarUrl);
      profileAvatar.setProps({ url: avatarUrl });
    }
  }

  private async handleExitClick(): Promise<void> {
    await UserApi.logout();
    router.go('/');
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

    this.formState.email = user.email;
    this.formState.login = user.login;
    this.formState.first_name = user.first_name;
    this.formState.second_name = user.second_name;
    this.formState.phone = user.phone;
    this.formState.profileName = user.display_name;

    this.updateInputValues();
    this.updateControlsState();
    this.updateAvatarDisplay();

    this.setProps({
      profileName: user.display_name,
    });
  }

  private updateInputValues(): void {
    const emailInput = this.children.EmailInput as ProfileInput;
    const loginInput = this.children.LoginInput as ProfileInput;
    const nameInput = this.children.NameInput as ProfileInput;
    const secondNameInput = this.children.SecondNameInput as ProfileInput;
    const phoneInput = this.children.PhoneInput as ProfileInput;

    if (emailInput) emailInput.setProps({ value: this.formState.email });
    if (loginInput) loginInput.setProps({ value: this.formState.login });
    if (nameInput) nameInput.setProps({ value: this.formState.first_name });
    if (secondNameInput) secondNameInput.setProps({ value: this.formState.second_name });
    if (phoneInput) phoneInput.setProps({ value: this.formState.phone });
  }

  private async handleSubmit(): Promise<void> {
    const isFormValid = this.validateAllFields();
    if (!isFormValid) {
      return;
    }

    try {
      await UserApi.updateProfile({
        email: this.formState.email,
        login: this.formState.login,
        first_name: this.formState.first_name,
        second_name: this.formState.second_name,
        phone: this.formState.phone,
        display_name: this.formState.profileName,
      });

      const user = authStore.getUser();
      if (user) {
        authStore.setUser({
          ...user,
          email: this.formState.email,
          login: this.formState.login,
          first_name: this.formState.first_name,
          second_name: this.formState.second_name,
          phone: this.formState.phone,
          display_name: this.formState.profileName,
        });
      }

      console.log('Профиль успешно обновлен');
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  }

  render(): string {
    return template;
  }
}

export default ProfileFormEdit;
