import Block from '../../lib/block/block';
import { IBlockProps } from '../../lib/block/interfaces';
import template from './profile-avatar.hbs?raw';
import { TAvatar } from './types';

interface IProps extends IBlockProps {
  url?: string;
  type?: TAvatar;
  name?: string;
  onClick?: () => void;
}

class ProfileAvatar extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: `profile__avatar profile__avatar_${props.type}`,
      src: props.url,
      alt: props.name,
      events: {
        click: () => {
          if (props.type === 'large' && props.onClick) {
            props.onClick();
          }
        },
      },
    });
  }

  render() {
    return template;
  }
}

export default ProfileAvatar;
