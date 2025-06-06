import Block from '../../lib/block/block';
import { TEvents } from '../../lib/block/interfaces';
import template from './chat-preview.hbs?raw';
import { IProps } from './types/types';
import ProfileAvatar from '../profile-avatar/profile-avatar';

class ChatPreview extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'chat-preview-wrapper',
      ProfileAvatarComponent: new ProfileAvatar({
        type: 'small',
        url: props.avatarSrc,
        name: props.avatarName,
      }),
      events: {
        click: (e: Event) => {
          console.log('ChatPreview click triggered for chatId:', props.chatId);
          e.preventDefault();
          e.stopPropagation();
          if (props.onClick) {
            console.log('Calling props.onClick for chatId:', props.chatId);
            props.onClick(e);
          } else {
            console.log('No onClick handler for chatId:', props.chatId);
          }
        },
      } as TEvents,
    });
  }

  render(): string {
    return template;
  }
}

export default ChatPreview;
