import { TEvents } from './block.type';

export interface IBlockProps {
  className?: string;
  attrs?: Record<string, string>;
  events?: TEvents;
  [key: string]: any;
}
