import Block from '../../shared/lib/block/block.ts';
import { IBlockProps } from '../../shared/lib/block/interfaces';
import Button from '../../shared/ui/button/button.ts';
import Link from '../../shared/ui/link/link.ts';
import ProfileInput from '../../shared/ui/profile-input/profile-input.ts';
import { validateField } from '../../shared/lib/validation';
import template from './sign-up-form.hbs?raw';

interface IProps extends IBlockProps {
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password: string;
  password_confirm: string;
}

class SignUpForm extends Block {
  private readonly formState: IProps;

  constructor(props: IProps) {
    const INITIAL_STATE: IProps = {
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
      formState: INITIAL_STATE,
      EmailInput: new ProfileInput({
        type: 'email',
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
      FirstNameInput: new ProfileInput({
        type: 'text',
        name: 'first_name',
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
      PasswordInput: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль',
        value: INITIAL_STATE.password,
        onInput: value => {
          this.updateField('password', value);
        },
      }),
      PasswordConfirmInput: new ProfileInput({
        type: 'password',
        name: 'password',
        placeholder: 'Пароль (еще раз)',
        value: INITIAL_STATE.password_confirm,
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
        theme: 'primary',
        path: new URL('http://localhost:3000/sign-in'),
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

  private isFormValid(): boolean {
    const hasAllFields = Object.values(this.formState).every(value => value.length > 0);

    if (!hasAllFields) {
      return false;
    }

    const emailError = validateField('email', this.formState.email);
    const loginError = validateField('login', this.formState.login);
    const firstNameError = validateField('first_name', this.formState.first_name);
    const secondNameError = validateField('second_name', this.formState.second_name);
    const phoneError = validateField('phone', this.formState.phone);
    const passwordError = validateField('password', this.formState.password);

    const passwordsMatch = this.formState.password === this.formState.password_confirm;

    return (
      !emailError &&
      !loginError &&
      !firstNameError &&
      !secondNameError &&
      !phoneError &&
      !passwordError &&
      passwordsMatch
    );
  }

  private updateControlsState(): void {
    const isValid = this.isFormValid();

    const buttonChild = this.children.SignUpButton as Button;
    if (buttonChild && buttonChild.setProps) {
      buttonChild.setProps({ disabled: !isValid });
    }
  }

  private validateAllFields(): boolean {
    let isAllValid = true;

    Object.keys(this.formState).forEach(fieldName => {
      if (fieldName === 'password_confirm') return;

      const value = this.formState[fieldName as keyof IProps];
      const errorMessage = validateField(fieldName, value);

      if (errorMessage) {
        isAllValid = false;
      }
    });

    const passwordsMatch = this.formState.password === this.formState.password_confirm;
    if (!passwordsMatch) {
      isAllValid = false;
    }

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

export default SignUpForm;
