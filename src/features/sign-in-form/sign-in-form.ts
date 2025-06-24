import Block from '../../shared/lib/block/block.ts';
import { IBlockProps } from '@/shared/lib/block/interfaces';
import Button from '../../shared/ui/button/button.ts';
import Link from '../../shared/ui/link/link.ts';
import ProfileInput from '../../shared/ui/profile-input/profile-input.ts';
import { clearFieldError, showFieldError, validateField } from '@/shared/lib/validation';
import template from './sign-in-form.hbs?raw';

interface IProps extends IBlockProps {
  login: string;
  password: string;
}

class SignInForm extends Block {
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
        path: new URL('/sign-up', window.location.origin),
      }),
    });

    this.formState = INITIAL_STATE;
    this.updateControlsState();
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

  private handleSubmit(): void {
    const isFormValid = this.validateAllFields();

    if (!isFormValid) {
      return;
    }

    console.log('Форма отправлена:', this.formState);
  }

  public render(): string {
    return template;
  }
}

export default SignInForm;
