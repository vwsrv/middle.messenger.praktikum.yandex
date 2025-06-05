import Block from '../../shared/lib/block/block.ts';
import { IBlockProps } from '../../shared/lib/block/interfaces';
import Button from '../../shared/ui/button/button.ts';
import Link from '../../shared/ui/link/link.ts';
import ProfileInput from '../../shared/ui/profile-input/profile-input.ts';
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
      }),
      PasswordInput: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль',
        value: INITIAL_STATE.password,
        onInput: value => {
          this.updateField('password', value);
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
    this.props.SignUpButton?.setProps?.({ disabled: isDisabled });
  }

  private handleSubmit(): void {
    //TODO: body на бэк
    console.log('Форма отправлена:', this.formState);
  }

  public render(): string {
    return template;
  }
}

export default SignInForm;
