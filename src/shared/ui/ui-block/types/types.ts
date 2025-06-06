import { IBlockProps } from '../../../lib/block/interfaces';

export type TUiBlock = 'message';

export interface IProps extends IBlockProps {
  type: TUiBlock;
  selected?: boolean;
  id?: string;
  onClick?: (e: Event) => void;
}
