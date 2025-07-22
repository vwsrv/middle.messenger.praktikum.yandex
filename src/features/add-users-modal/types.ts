import { IBlockProps } from '@/shared/lib/block/interfaces';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user';

export interface IUserWithSelection extends IFindUserResponse {
  isSelected?: boolean;
}

export interface IProps extends IBlockProps {
  isOpen: boolean;
  users?: IUserWithSelection[];
  selectedUser?: IFindUserResponse | null;
  searchQuery?: string;
  isLoading?: boolean;
  activeChatId?: string;
  onClose: () => void;
  onCreateChat?: (users: any[]) => Promise<void>;
  onAddUsersToChat?: (users: any[]) => Promise<void>;
  onUserAddedToChat?: (chatId: number, userId: number) => Promise<void>;
  onSystemMessage?: (systemMessage: any) => void;
  getActiveChatId?: () => string | undefined;
}
