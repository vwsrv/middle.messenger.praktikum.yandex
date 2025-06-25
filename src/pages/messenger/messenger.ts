import Block from '../../shared/lib/block/block';
import template from './chats.hbs?raw';
import { ChatLayout } from '../../features/chats';
import { IChat, IMessage } from '../../features/chats/types/types';

const MOCK_MESSAGES: IMessage[] = [
  {
    id: '1',
    text: 'Привет! Как дела?',
    type: 'incoming',
    status: 'read',
    time: '12:30',
    active: false,
  },
  {
    id: '2',
    text: 'Привет! Все отлично, спасибо! А у тебя как?',
    type: 'outgoing',
    status: 'delivered',
    time: '12:32',
    active: false,
  },
  {
    id: '3',
    text: 'Тоже все хорошо! Планы на выходные есть?',
    type: 'incoming',
    status: 'read',
    time: '12:35',
    active: false,
  },
  {
    id: '4',
    text: 'Да, думаю съездить на дачу. А ты?',
    type: 'outgoing',
    status: 'sent',
    time: '12:37',
    active: false,
  },
];

const MOCK_CHATS: IChat[] = [
  {
    id: '1',
    profileName: 'Андрей',
    avatar: 'https://via.placeholder.com/40',
    sentTime: '12:37',
    messageText: 'Да, думаю съездить на дачу. А ты?',
    messageCount: 2,
    messages: MOCK_MESSAGES,
  },
  {
    id: '2',
    profileName: 'Мария',
    avatar: 'https://via.placeholder.com/40',
    sentTime: '11:20',
    messageText: 'Увидимся завтра!',
    messageCount: 0,
    messages: [
      {
        id: '5',
        text: 'Увидимся завтра!',
        type: 'incoming',
        status: 'read',
        time: '11:20',
        active: false,
      },
    ],
  },
  {
    id: '3',
    profileName: 'Команда проекта',
    avatar: 'https://via.placeholder.com/40',
    sentTime: '10:15',
    messageText: 'Встреча перенесена на 15:00',
    messageCount: 5,
    messages: [
      {
        id: '6',
        text: 'Встреча перенесена на 15:00',
        type: 'incoming',
        status: 'read',
        time: '10:15',
        active: false,
      },
    ],
  },
];

export class MessengerPage extends Block {
  constructor() {
    super('main', {
      className: 'messenger-page',
      ChatLayoutComponent: new ChatLayout({
        chats: MOCK_CHATS,
        activeChat: MOCK_CHATS[0],
        onChatSelect: (chatId: string) => {
          this.handleChatSelect(chatId);
        },
        onSendMessage: (message: string) => {
          this.handleSendMessage(message);
        },
      }),
    });
  }

  private handleChatSelect = (chatId: string): void => {
    const selectedChat = MOCK_CHATS.find(chat => chat.id === chatId);
    if (selectedChat) {
      this.props.ChatLayoutComponent?.setProps?.({
        activeChat: selectedChat,
      });
    }
  };

  private handleSendMessage = (message: string): void => {
    console.log('Отправка сообщения:', message);
    // TODO: Здесь будет логика отправки сообщения через API
  };

  render(): string {
    return template;
  }
}

export default MessengerPage;
