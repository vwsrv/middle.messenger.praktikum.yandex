import { IBlockProps } from '../../../../../shared/lib/block/interfaces';
import { IChat } from '../../../types/types';
import ChatPreview from '../../../../../shared/ui/chat-preview/chat-preview';

export interface IProps extends IBlockProps {
  chats: IChat[];
  selectedChatId?: string;
  ChatPreviews?: ChatPreview[];
  onChatSelect?: (chatId: string) => void;
  onProfileClick?: () => void;
  onSearch?: (query: string) => void;
}
