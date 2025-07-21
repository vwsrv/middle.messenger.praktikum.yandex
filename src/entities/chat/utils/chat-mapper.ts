import { IChatResponse } from '@/entities/chat/models/interfaces';
import { IChat, IMessage } from '@/features/chats/types/types';

export const mapChatFromApi = (chatResponse: IChatResponse): IChat => {
  const lastMessage = chatResponse.last_message;

  const mappedChat = {
    id: chatResponse.id.toString(),
    profileName: chatResponse.title || lastMessage?.user.first_name || 'Пользователь',
    avatar: lastMessage?.user.avatar || chatResponse.avatar || undefined,
    sentTime: lastMessage?.time ? formatTime(lastMessage.time) : '',
    messageText: lastMessage?.content || 'Нет сообщений',
    messageCount: chatResponse.unread_count,
    messages: [],
  };

  return mappedChat;
};

export const mapChatsFromApi = (chatsResponse: IChatResponse[]): IChat[] => {
  return chatsResponse.map(mapChatFromApi);
};

export const mapMessageFromWebSocket = (wsMessage: any, currentUserId: number): IMessage => {
  if (!wsMessage || typeof wsMessage !== 'object') {
    throw new Error('Некорректная структура сообщения');
  }

  const hasRequiredFields =
    wsMessage.id && wsMessage.content && wsMessage.time && wsMessage.user_id;
  if (!hasRequiredFields) {
    throw new Error('Отсутствуют обязательные поля в сообщении');
  }

  const isOutgoing = wsMessage.user_id === currentUserId;

  const mappedMessage: IMessage = {
    id: wsMessage.id.toString(),
    text: wsMessage.content,
    type: isOutgoing ? 'outgoing' : 'incoming',
    status: 'read',
    time: formatTime(wsMessage.time),
    originalTime: wsMessage.time,
    active: false,
  };

  return mappedMessage;
};

const formatTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);
    const formattedTime = date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return formattedTime;
  } catch {
    return '00:00';
  }
};
