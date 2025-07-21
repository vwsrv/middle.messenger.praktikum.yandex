import Block from '../../../../shared/lib/block/block';
import template from './chat-header.hbs?raw';
import { IProps } from './types/types';
import Button from '../../../../shared/ui/button/button';
import ProfileAvatar from '../../../../shared/ui/profile-avatar/profile-avatar';
import Dropdown from '../../../../shared/ui/dropdown/dropdown';
import DropdownItem from '../../../../shared/ui/dropdown-item/dropdown-item';

class ChatHeader extends Block {
  private isMenuDropdownOpen: boolean = false;
  private menuDropdown: Dropdown;
  private addUserItem: DropdownItem;
  private deleteChatItem: DropdownItem;
  private deleteUserItem: DropdownItem;

  constructor(props: IProps) {
    const addUserItem = new DropdownItem({
      src: '/icons/dropdown-add-user.icon.svg',
      name: 'Добавить пользователя',
      onClick: () => {
        this.handleAddUser();
        this.toggleMenuDropdown();
      },
    });
    const deleteUserItem = new DropdownItem({
      src: '/icons/dropdown-delete-user.icon.svg',
      name: 'Удалить пользователя',
      onClick: () => {
        this.handleDeleteUser();
        this.toggleMenuDropdown();
      },
    });
    const deleteChatItem = new DropdownItem({
      src: '/icons/dropdown-delete-user.icon.svg',
      name: 'Удалить чат',
      onClick: () => {
        this.handleDeleteChat();
        this.toggleMenuDropdown();
      },
    });
    const menuDropdown = new Dropdown({
      view: false,
      DropdownItems: [addUserItem, deleteUserItem, deleteChatItem],
    });

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
      MenuDropdown: menuDropdown,
    });

    this.menuDropdown = menuDropdown;
    this.addUserItem = addUserItem;
    this.deleteChatItem = deleteChatItem;
    this.deleteUserItem = deleteUserItem;
  }

  private handleAddUser = (): void => {
    if (this.props.onAddUser) {
      this.props.onAddUser();
    }
  };

  private handleDeleteChat = (): void => {
    if (this.props.onDeleteChat) {
      this.props.onDeleteChat();
    }
  };

  private handleDeleteUser = (): void => {
    if (this.props.onDeleteUser) {
      this.props.onDeleteUser();
    }
  };

  private toggleMenuDropdown = (): void => {
    this.isMenuDropdownOpen = !this.isMenuDropdownOpen;
    this.menuDropdown.setProps({ view: this.isMenuDropdownOpen });
  };

  render(): string {
    return template;
  }
}

export default ChatHeader;
