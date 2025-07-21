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
          e.preventDefault();
          e.stopPropagation();

          if (props.onClick) {
            props.onClick(e);
          }

          if (props.onChatSelect && props.chatId) {
            props.onChatSelect(props.chatId);
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
