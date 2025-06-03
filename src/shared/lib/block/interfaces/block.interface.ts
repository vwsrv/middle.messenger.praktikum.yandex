import { TEvents } from './block.type';

export interface IMeta {
  tagName: string;
  props: Record<string, any>;
}

export interface IBlockProps {
  className?: string;
  attrs?: Record<string, string>;
  events?: TEvents;
  [key: string]: any;
}
