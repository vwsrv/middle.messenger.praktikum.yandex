export const chats = [
  {
    id: 1,
    profileName: 'Анна',
    avatar: '',
    sentTime: '12:30',
    messageText: 'Привет, как дела?',
    messageCount: 3,
    isActive: false,
  },
  {
    id: 2,
    profileName: 'Иван',
    avatar: '',
    sentTime: '10:15',
    messageText: 'Документы готовы',
    messageCount: 0,
    isActive: true,
  },
];

export const messages = {
  1: [],
  2: [
    {
      type: 'inbox',
      text: 'Документы готовы к отправке',
      time: '10:15',
      status: 'read',
    },
    {
      type: 'inbox',
      text: 'Спасибо, я их проверю',
      time: '10:18',
      status: 'delivered',
    },
  ],
};
