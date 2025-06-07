import { IBlockProps } from '../../../../../shared/lib/block/interfaces';

export interface IProps extends IBlockProps {
  onSendMessage?: (message: string) => void;
  onAttachFile?: () => void;
}
