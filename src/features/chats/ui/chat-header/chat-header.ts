import Block from '../../../../shared/lib/block/block';
import template from './chat-header.hbs?raw';
import { IProps } from './types/types';
import Button from '../../../../shared/ui/button/button';
import ProfileAvatar from '../../../../shared/ui/profile-avatar/profile-avatar';
import Dropdown from '../../../../shared/ui/dropdown/dropdown';
import DropdownItem from '../../../../shared/ui/dropdown-item/dropdown-item';

class ChatHeader extends Block {
  private isMenuDropdownOpen: boolean = false;

  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'chat-header-wrapper',
      ProfileAvatarComponent: new ProfileAvatar({
        type: 'small',
        url: props.profileAvatar,
        name: props.profileName,
      }),
      MenuButton: new Button({
        type: 'button',
        theme: 'dots',
        onClick: () => {
          this.toggleMenuDropdown();
        },
      }),
      MenuDropdown: new Dropdown({
        view: false,
        DropdownItems: [
          new DropdownItem({
            src: '/icons/add-user.svg',
            name: 'Добавить пользователя',
            onClick: () => {
              console.log('Добавить пользователя');
              this.toggleMenuDropdown();
            },
          }),
          new DropdownItem({
            src: '/icons/delete.svg',
            name: 'Удалить чат',
            onClick: () => {
              console.log('Удалить чат');
              this.toggleMenuDropdown();
            },
          }),
        ],
      }),
    });
  }

  private toggleMenuDropdown = (): void => {
    this.isMenuDropdownOpen = !this.isMenuDropdownOpen;

    const newDropdown = new Dropdown({
      view: this.isMenuDropdownOpen,
      DropdownItems: [
        new DropdownItem({
          src: '/icons/add-user.svg',
          name: 'Добавить пользователя',
          onClick: () => {
            this.toggleMenuDropdown();
          },
        }),
        new DropdownItem({
          src: '/icons/delete.svg',
          name: 'Удалить чат',
          onClick: () => {
            this.toggleMenuDropdown();
          },
        }),
      ],
    });

    this.children.MenuDropdown = newDropdown;

    this.setProps({
      MenuDropdown: newDropdown,
    });

    this._render();
  };

  render(): string {
    return template;
  }
}

export default ChatHeader;
