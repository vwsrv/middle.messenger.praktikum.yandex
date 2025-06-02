import Block from "../block";

export type TChildren = Record<string, Block | Block[]>;
export type TEvents = Record<string, (...args: unknown[]) => void>;
