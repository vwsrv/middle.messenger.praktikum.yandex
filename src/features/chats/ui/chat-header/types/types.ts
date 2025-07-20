import { IBlockProps } from '../../../../../shared/lib/block/interfaces';

export interface IProps extends IBlockProps {
  profileName: string;
  profileAvatar?: string;
  onMenuClick?: () => void;
  onChatCreated?: (chatId: number) => void;
}
