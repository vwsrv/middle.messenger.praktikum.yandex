import { IBlockProps } from '@/shared/lib/block/interfaces';

export type TRouter = new (props: IBlockProps) => {
  getContent: () => HTMLElement;
  hide?: () => void;
  componentDidMount?: () => void;
};
