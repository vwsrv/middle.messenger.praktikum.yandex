import Block from '../../../lib/block/block';
import { IBlockProps } from '../../../lib/block/interfaces';

export type TModal = 'opened' | 'closed';

export interface IProps extends IBlockProps {
  isOpen: boolean;
  content: Block;
  onClose: () => void;
  onSubmit?: () => void;
  status: TModal;
  title: string;
  type?: string;
  children?: Record<string, Block | Block[]>;
  error?: string;
}
