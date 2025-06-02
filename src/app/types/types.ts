import { Block } from '../../shared/lib/block/block';
import { IComponentConstructor } from '../../shared/lib/types';

export type TPageSource = string | IComponentConstructor;
export type TPageContext = Record<string, unknown>;

export interface IPage {
    source: TPageSource;
    context: TPageContext;
}

export interface IPages {
    [key: string]: [TPageSource, TPageContext];
}

export interface INavigateEvent extends MouseEvent {
    target: HTMLElement;
}

export type TNavigate = (page: string) => void; 
