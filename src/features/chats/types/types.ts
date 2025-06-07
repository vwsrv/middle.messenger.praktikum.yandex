import { IBlockProps } from '../../../shared/lib/block/interfaces';

export interface IMessage {
  id: string;
  text: string;
  type: 'incoming' | 'outgoing';
  status?: 'sent' | 'delivered' | 'read';
  time: string;
  active?: boolean;
}

export interface IChat {
  id: string;
  profileName: string;
  avatar?: string;
  sentTime: string;
  messageText: string;
  messageCount?: number;
  messages: IMessage[];
}

export interface IProps extends IBlockProps {
  chats?: IChat[];
  activeChat?: IChat;
  onChatSelect?: (chatId: string) => void;
  onSendMessage?: (message: string) => void;
}
