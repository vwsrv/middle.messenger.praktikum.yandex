import Block from '../../shared/lib/block/block';
import SignInForm from '../../features/sign-in-form/sign-in-form';
import template from './sign-in.hbs?raw';
import { TBlock } from '../../shared/lib';
import Handlebars from 'handlebars';

interface IPageState extends TBlock {
    form: SignInForm;
}

class PageSignIn extends Block<IPageState> {
    constructor() {
        const form = new SignInForm();
        super('div', { form });
        this.dispatchComponentDidMount();
    }

    public render(): string {
        const { form, ...rest } = this.props;
        const processedProps = {
            ...rest,
            form: form.getContent().outerHTML
        };
        return Handlebars.compile(template)(processedProps);
    }
}

export default PageSignIn;
