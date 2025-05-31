import {TLink} from "./types";
import Block from "../../lib/block/block.ts";
import {TBlock} from "../../lib";
import template from './link.hbs?raw';

interface IProps extends TBlock {
    type: TLink;
    path: string;
    name: string;
    events: {
        onClick: (evt: Event) => void;
    }
}

class Link extends Block<TBlock> {
    constructor(props: IProps) {
        super('a', {
            ...props,
            events: {
                click: props.events?.onClick || (() => {})
            }
        });
    }

    public render(): string {
        return template;
    }
}

export default Link;

