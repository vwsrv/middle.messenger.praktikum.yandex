import Block from "../../block/block.ts";
import {IBlockProps} from "../../block";

export interface IComponentConstructor<T extends IBlockProps = IBlockProps> {
    new (props: T): Block;
}

export interface IRegisterComponentOptions {
    name: string;
    Component: IComponentConstructor;
}

export interface IRenderDomOptions {
    query: string;
    block: Block;
}

export type TComponentId = string;
