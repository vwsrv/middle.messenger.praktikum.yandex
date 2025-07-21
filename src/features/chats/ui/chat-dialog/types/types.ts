import { IBlockProps } from '../../../../../shared/lib/block/interfaces';
import { IMessage } from '../../../types/types';

export interface IProps extends IBlockProps {
  createDate: string;
  messages: IMessage[];
  systemMessages?: ISystemMessage[];
}

export interface ISystemMessage {
  id: string;
  type: 'user_joined' | 'user_left' | 'system';
  content: string;
}
