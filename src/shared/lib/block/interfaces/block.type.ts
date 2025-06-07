import Block from '../block';

export type TChildren = Record<string, Block | Block[]>;

type TEventHandler = (...args: unknown[]) => void;

export type TEvents = {
  click?: TEventHandler;
  submit?: TEventHandler;
  change?: TEventHandler;
  input?: TEventHandler;
  blur?: TEventHandler;
} & Record<string, TEventHandler | undefined>;
