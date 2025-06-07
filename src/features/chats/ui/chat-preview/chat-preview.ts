import Block from '../../../../shared/lib/block/block';
import ProfileAvatar from '../../../../shared/ui/profile-avatar/profile-avatar.ts';
import { IBlockProps, TEvents } from '@/shared/lib/block/interfaces';
import template from './chat-preview.hbs?raw';

export interface IProps extends IBlockProps {
  isSelected?: boolean;
  chatId?: string;
  avatarSrc?: string;
  avatarName?: string;
  name: string;
  time: string;
  message: string;
  count?: number;
  onClick?: (e: Event) => void;
}

class ChatPreview extends Block {
  constructor(props: IProps) {
    const selectedClass = props.isSelected ? 'block__container_selected' : '';

    super('div', {
      ...props,
      className: `chat-preview-wrapper block__container_message ${selectedClass}`,
      ProfileAvatarComponent: new ProfileAvatar({
        type: 'small',
        url: props.avatarSrc,
        name: props.avatarName,
      }),
      events: {
        click: (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
        },
      } as TEvents,
    });
  }

  render(): string {
    return template;
  }

  public setSelected(isSelected: boolean): void {
    const selectedClass = 'block__container_selected';
    const element = this.getContent();

    if (isSelected) {
      element?.classList.add(selectedClass);
    } else {
      element?.classList.remove(selectedClass);
    }
  }
}

export default ChatPreview;
