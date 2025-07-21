/**
 * Интерфейс для загрузки аватара пользователя
 * Используется FormData для отправки файла
 */

export interface IUserAvatarRequest {
  avatar: FormData;
}
