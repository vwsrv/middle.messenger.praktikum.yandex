import Block from '../../shared/lib/block/block.ts';
import { IBlockProps } from '../../shared/lib/block/interfaces';
import Button from '../../shared/ui/button/button.ts';
import Link from '../../shared/ui/link/link.ts';
import ProfileInput from '../../shared/ui/profile-input/profile-input.ts';

import template from './sign-up-form.hbs?raw';

interface IProps extends IBlockProps {
  type: string;
}

interface IFormState {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password: string;
  password_confirm: string;
}

class SignUpForm extends Block {
  private formState: IFormState;

  constructor(props: IProps) {
    const initialState: IFormState = {
      email: '',
      login: '',
      first_name: '',
      second_name: '',
      phone: '',
      password: '',
      password_confirm: '',
    };

    super('div', {
      ...props,
      className: 'sign-up-form',
      formState: initialState,
      EmailInput: new ProfileInput({
        type: 'email',
        name: 'email',
        placeholder: 'Почта',
        value: initialState.email,
        onInput: value => {
          this.updateField('email', value);
        },
      }),
      LoginInput: new ProfileInput({
        type: 'text',
        name: 'login',
        placeholder: 'Логин',
        value: initialState.login,
        onInput: value => {
          this.updateField('login', value);
        },
      }),
      FirstNameInput: new ProfileInput({
        type: 'text',
        name: 'first_name',
        placeholder: 'Имя',
        value: initialState.first_name,
        onInput: value => {
          this.updateField('first_name', value);
        },
      }),
      SecondNameInput: new ProfileInput({
        type: 'text',
        name: 'second_name',
        placeholder: 'Фамилия',
        value: initialState.second_name,
        onInput: value => {
          this.updateField('second_name', value);
        },
      }),
      PhoneInput: new ProfileInput({
        type: 'tel',
        name: 'phone',
        placeholder: 'Телефон',
        value: initialState.phone,
        onInput: value => {
          this.updateField('phone', value);
        },
      }),
      PasswordInput: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль',
        value: initialState.password,
        onInput: value => {
          this.updateField('password', value);
        },
      }),
      PasswordConfirmInput: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль (еще раз)',
        value: initialState.password_confirm,
        onInput: value => {
          this.updateField('password_confirm', value);
        },
      }),
      SignUpButton: new Button({
        label: 'Зарегистрироваться',
        theme: 'primary',
        disabled: true,
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          this.handleSubmit();
        },
      }),
      SignUpLink: new Link({
        name: 'Уже зарегистрированы? Войти',
        border: false,
        theme: 'primary',
        path: new URL('/sign-in', window.location.origin),
      }),
    });

    this.formState = initialState;
  }

  private updateField(field: keyof IFormState, value: string): void {
    this.formState[field] = value;
    this.updateButtonState();
  }

  private isFormValid(): boolean {
    return Object.values(this.formState).every(value => value.length > 0);
  }

  private updateButtonState(): void {
    const isDisabled = !this.isFormValid();
    this.props.SignUpButton?.setProps?.({ disabled: isDisabled });
  }

  private handleSubmit(): void {
    const isPasswordMatch = this.formState.password === this.formState.password_confirm;

    if (!isPasswordMatch) {
      this.props.PasswordConfirmInput?.setProps?.({
        error: 'Пароли не совпадают',
      });
      return;
    }

    console.log('Форма отправлена:', this.formState);
  }

  public render(): string {
    return template;
  }
}

export default SignUpForm;
