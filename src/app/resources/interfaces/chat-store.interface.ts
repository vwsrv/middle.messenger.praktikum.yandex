import { IStoreState } from '@/shared/lib/store';
import { IChatResponse } from '@/entities/chat';
import { IMessageResponse } from '@/entities/message';

export interface IChatStore extends IStoreState {
  chats: IChatResponse[];
  currentChatId: number | null;
  messages: Record<number, IMessageResponse[]>;
  isLoading: boolean;
  error: string | null;
}
