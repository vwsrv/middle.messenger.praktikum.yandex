export type TEventCallback = (event: Event) => void;

export type TEvents = {
    [K in keyof HTMLElementEventMap]?: TEventCallback;
} & {
    [key: string]: TEventCallback;
};

export type TBlock = {
    events?: TEvents;
    [key: string]: unknown;
}

export type IBlockProps = TBlock;
