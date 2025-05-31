import Block from "../../lib/block/block";
import { TBlock } from "../../lib";
import template from './profile-input.hbs?raw';
import { TProfileInput } from "./types";

interface IProps extends TBlock {
    name: string;
    type: string;
    placeholder: string;
    className: TProfileInput;
    value?: string;
    error?: string;
    events?: Record<string, (e: Event) => void>;
}

export class ProfileInput extends Block<IProps> {
    constructor(props: IProps) {
        super('div', {
            ...props,
            events: {
                ...props.events,
                input: (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    this.setProps({ value: target.value });
                },
                blur: (e: Event) => {
                    if (props.events?.blur) {
                        props.events.blur(e);
                    }
                }
            }
        });
    }

    public getValue(): string {
        return (this.element?.querySelector('input')?.value || '').trim();
    }

    public render(): string {
        console.log('ProfileInput props:', this.props);
        return template;
    }
}
export default ProfileInput;

