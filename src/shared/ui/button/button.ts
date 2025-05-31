import Block from "../../lib/block/block";
import { TBlock } from "../../lib";
import template from './button.hbs?raw';
import { TButton } from "./types";

interface IProps extends TBlock {
    type: 'submit' | 'button';
    theme: TButton
    label: string;
    events?: {
        click: () => void;
    };
}

export default class Button extends Block<IProps> {
    constructor(props: IProps) {
        super('button', {
            ...props,
            theme: `${props.theme}`,
            events: {
                click: props.events?.click || (() => {})
            }
        });
    }

    public render(): string {
        return template;
    }
}
