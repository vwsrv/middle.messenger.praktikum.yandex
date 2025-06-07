import { IBlockProps } from '../../../lib/block/interfaces';

export interface IProps extends IBlockProps {
  isSelected?: boolean;
  chatId?: string;
  avatarSrc?: string;
  avatarName?: string;
  name: string;
  time: string;
  message: string;
  count?: number;
  onClick?: (e: Event) => void;
}
