import Block from "../../lib/block/block.ts";
import {TUiBlock} from "./types";
import {IBlockProps} from "../../lib";
import template from './ui-block.hbs?raw'

interface IProps extends IBlockProps {
    type: TUiBlock;
}

class BlockContainer extends Block<IProps> {
    constructor(props: IProps) {
        super('div', props)
    }

    protected render(): string {
        return template;
    }
}

export default BlockContainer;

