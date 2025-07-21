import Block from '../../../shared/lib/block/block.ts';
import { IBlockProps } from '@/shared/lib/block/interfaces';
import Button from '../../../shared/ui/button/button.ts';
import Link from '../../../shared/ui/link/link.ts';
import ProfileInput from '../../../shared/ui/profile-input/profile-input.ts';
import { clearFieldError, showFieldError, validateField } from '@/shared/lib/validation';
import template from './login.hbs?raw';
import UserApi from '@/entities/user/api/user.api.ts';
import { IUserDataResponse } from '@/entities/user/models/interfaces/user-data/user-data-response.interface.ts';

interface IProps extends IBlockProps {
  login: string;
  password: string;
  onSuccess?: (userData: IUserDataResponse) => void;
  onError?: (error: Error) => void;
}

class Login extends Block {
  private readonly formState: IProps;

  constructor(props: IProps) {
    const INITIAL_STATE: IProps = {
      login: '',
      password: '',
    };

    super('div', {
      ...props,
      className: 'sign-in-form',
      formState: INITIAL_STATE,
      LoginInput: new ProfileInput({
        type: 'text',
        name: 'login',
        placeholder: 'Логин',
        value: INITIAL_STATE.login,
        onInput: value => {
          this.updateField('login', value);
        },
        onBlur: value => {
          this.validateFieldOnBlur('login', value);
        },
      }),
      PasswordInput: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль',
        value: INITIAL_STATE.password,
        onInput: value => {
          this.updateField('password', value);
        },
        onBlur: value => {
          this.validateFieldOnBlur('password', value);
        },
      }),
      SignInButton: new Button({
        label: 'Войти',
        theme: 'primary',
        disabled: true,
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          this.handleSubmit();
        },
      }),
      SignInLink: new Link({
        name: 'Еще не зарегистрированы? Регистрация',
        border: false,
        theme: 'primary',
        path: '/sign-up',
      }),
    });

    this.formState = INITIAL_STATE;
    this.bindFormEvents();
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

  private validateFieldOnBlur(fieldName: Extract<keyof IProps, string>, value: string): void {
    const errorMessage = validateField(fieldName, value);
    const inputElement = this.getInputElement(fieldName);

    if (errorMessage) {
      showFieldError(fieldName, errorMessage, inputElement);
    } else {
      clearFieldError(inputElement);
    }

    this.updateControlsState();
  }

  private getInputElement(fieldName: string): HTMLInputElement | undefined {
    const form = this.getContent()?.querySelector('form');
    return form?.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
  }

  private isFormValid(): boolean {
    const hasAllFields = Object.values(this.formState).every(value => value.length > 0);

    if (!hasAllFields) {
      return false;
    }

    const loginError = validateField('login', this.formState.login);
    const passwordError = validateField('password', this.formState.password);

    return !loginError && !passwordError;
  }

  private updateControlsState(): void {
    const isValid = this.isFormValid();

    const buttonChild = this.children.SignInButton as Button;
    if (buttonChild && buttonChild.setProps) {
      buttonChild.setProps({ disabled: !isValid });
    }
  }

  private validateAllFields(): boolean {
    let isAllValid = true;

    Object.keys(this.formState).forEach(fieldName => {
      const value = this.formState[fieldName as keyof IProps];
      const errorMessage = validateField(fieldName, value);
      const inputElement = this.getInputElement(fieldName);

      if (errorMessage) {
        showFieldError(fieldName, errorMessage, inputElement);
        isAllValid = false;
      } else {
        clearFieldError(inputElement);
      }
    });

    return isAllValid;
  }

  private setLoading(isLoading: boolean): void {
    const button = this.children.SignInButton as Button;
    button.setProps({
      disabled: isLoading,
      label: isLoading ? 'Вход...' : 'Войти',
    });
  }

  private async handleSubmit(): Promise<void> {
    const isFormValid = this.validateAllFields();
    if (!isFormValid) return;

    try {
      this.setLoading(true);

      await UserApi.signIn({
        login: this.formState.login,
        password: this.formState.password,
      });

      const user = await UserApi.getUser();

      this.props.onSuccess?.(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка входа';
      const passwordInput = this.children.PasswordInput as ProfileInput;
      if (passwordInput) {
        passwordInput.setProps({ error: errorMessage });
      }
      this.props.onError?.(error as Error);
    } finally {
      this.setLoading(false);
    }
  }

  public render(): string {
    return template;
  }
}

export default Login;
