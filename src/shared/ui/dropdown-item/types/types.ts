import { IBlockProps } from '../../../lib/block/interfaces';

export interface IProps extends IBlockProps {
  src: string;
  name: string;
  onClick?: () => void;
}
