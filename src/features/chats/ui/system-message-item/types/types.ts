import { IBlockProps } from '@/shared/lib/block/interfaces';

export interface IProps extends IBlockProps {
  id: string;
  type: 'user_joined' | 'user_left' | 'system';
  content: string;
}
