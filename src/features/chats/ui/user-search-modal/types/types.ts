import { IBlockProps } from '@/shared/lib/block/interfaces';

export interface IProps extends IBlockProps {
  onClose?: () => void;
  onCreateChat?: (userIds: number[]) => Promise<void>;
}
