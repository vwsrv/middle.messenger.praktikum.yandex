import { IBlockProps } from '../../../../../shared/lib/block/interfaces';
import { IChat } from '../../../types/types';

export interface IProps extends IBlockProps {
  chats: IChat[];
  selectedChatId?: string;
  onChatSelect?: (chatId: string) => void;
  onProfileClick?: () => void;
  onSearch?: (query: string) => void;
}
