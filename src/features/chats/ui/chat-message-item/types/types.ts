import { IBlockProps } from '../../../../../shared/lib/block/interfaces';

export interface IProps extends IBlockProps {
  id?: string;
  type: 'incoming' | 'outgoing';
  status?: 'sent' | 'delivered' | 'read';
  time: string;
  isSelected?: boolean;
  text: string;
}
