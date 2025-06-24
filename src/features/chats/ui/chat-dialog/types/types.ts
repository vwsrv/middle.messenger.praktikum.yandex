import { IBlockProps } from '../../../../../shared/lib/block/interfaces';
import { IMessage } from '../../../types/types';

export interface IProps extends IBlockProps {
  createDate: string;
  messages: IMessage[];
}
