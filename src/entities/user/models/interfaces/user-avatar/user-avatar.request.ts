/**
 * {
  "id": 123,
  "first_name": "Petya",
  "second_name": "Pupkin",
  "display_name": "Petya Pupkin",
  "phone": "+79001001100",
  "login": "userLogin",
  "avatar": "/path/to/avatar.jpg",
  "email": "string@ya.ru"
}
 */

export interface IUserAvatarRequest {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  avatar: string;
  email: string;
}
