import Block from '../../shared/lib/block/block';
import Button from '../../shared/ui/button/button';
import ProfileInput from '../../shared/ui/profile-input/profile-input';
import Link from '../../shared/ui/link/link';
import { TBlock } from '../../shared/lib';
import template from './sign-in-form.hbs?raw';
import Handlebars from 'handlebars';

interface IFormState extends TBlock {
    title: string;
    error: string;
    errors: Record<string, string>;
    login: ProfileInput;
    password: ProfileInput;
    button: Button;
    link: Link;
    events?: {
        submit: (e: Event) => void;
    };
}

export default class SignInForm extends Block<IFormState> {
    constructor() {
        const login = new ProfileInput({
            name: 'login',
            type: 'text',
            placeholder: 'Логин',
            className: 'profile',
            events: {
                blur: (e: Event) => this.validateField(e, 'login')
            }
        });

        const password = new ProfileInput({
            name: 'password',
            type: 'password',
            placeholder: 'Пароль',
            className: 'profile',
            events: {
                blur: (e: Event) => this.validateField(e, 'password')
            }
        });

        const button = new Button({
            type: 'submit',
            label: 'Войти',
            theme: 'primary'
        });

        const link = new Link({
            type: 'primary',
            path: '/sign-up',
            name: 'Ещё не зарегистрированы?',
            events: {
                onClick: () => console.log('Navigate to sign-up')
            }
        });

        super('div', {
            title: 'Вход',
            error: '',
            errors: {},
            login,
            password,
            button,
            link,
            events: {
                submit: (e: Event) => this.handleSubmit(e)
            }
        });
    }

    private validateField(e: Event, fieldName: 'login' | 'password') {
        const target = e.target as HTMLInputElement;
        const value = target.value.trim();
        let error = '';

        if (fieldName === 'login' && value.length < 3) {
            error = 'Логин должен быть не менее 3 символов';
        }

        if (fieldName === 'password' && value.length < 8) {
            error = 'Пароль должен быть не менее 8 символов';
        }

        this.props[fieldName].setProps({
            error,
            value
        });
    }

    private handleSubmit(e: Event) {
        e.preventDefault();
        
        if (Object.values(this.props.errors).some(Boolean)) {
            this.setProps({ error: 'Исправьте ошибки в полях' });
            return;
        }

        const formData = {
            login: this.props.login.getValue(),
            password: this.props.password.getValue()
        };

        console.log('Form submitted:', formData);
    }

    public render(): string {
        const { login, password, button, link, ...rest } = this.props;
        const processedProps = {
            ...rest,
            login: login.getContent().outerHTML,
            password: password.getContent().outerHTML,
            button: button.getContent().outerHTML,
            link: link.getContent().outerHTML
        };
        return Handlebars.compile(template)(processedProps);
    }
}
