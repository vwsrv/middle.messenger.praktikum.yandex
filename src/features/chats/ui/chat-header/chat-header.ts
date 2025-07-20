import Block from '../../../../shared/lib/block/block';
import template from './chat-header.hbs?raw';
import { IProps } from './types/types';
import Button from '../../../../shared/ui/button/button';
import ProfileAvatar from '../../../../shared/ui/profile-avatar/profile-avatar';
import Dropdown from '../../../../shared/ui/dropdown/dropdown';
import DropdownItem from '../../../../shared/ui/dropdown-item/dropdown-item';
import UserSearchModal from '../user-search-modal/user-search-modal';
import { ChatApi } from '@/entities/chat/api/chat.api';

class ChatHeader extends Block {
  private isMenuDropdownOpen: boolean = false;
  private userSearchModal!: UserSearchModal;
  private menuDropdown: Dropdown;
  private addUserItem: DropdownItem;
  private deleteChatItem: DropdownItem;

  constructor(props: IProps) {
    // Создаём DropdownItems один раз
    const addUserItem = new DropdownItem({
      src: '/icons/dropdown-add-user.icon.svg',
      name: 'Добавить пользователя',
      onClick: () => {
        this.handleAddUser();
        this.toggleMenuDropdown();
      },
    });
    const deleteChatItem = new DropdownItem({
      src: '/icons/dropdown-delete-user.icon.svg',
      name: 'Удалить чат',
      onClick: () => {
        console.log('Удалить чат');
        this.toggleMenuDropdown();
      },
    });
    const menuDropdown = new Dropdown({
      view: false,
      DropdownItems: [addUserItem, deleteChatItem],
    });

    // Создаём модалку сразу
    const userSearchModal = new UserSearchModal({
      onClose: () => {},
      onCreateChat: async (_userIds: number[]) => {},
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
      UserSearchModalComponent: userSearchModal,
    });

    this.menuDropdown = menuDropdown;
    this.addUserItem = addUserItem;
    this.deleteChatItem = deleteChatItem;
    this.userSearchModal = userSearchModal;
    this.initializeUserSearchModal();
  }

  private initializeUserSearchModal = (): void => {
    this.userSearchModal.setProps({
      onClose: () => {
        this.userSearchModal.close();
      },
      onCreateChat: async (userIds: number[]) => {
        await this.handleCreateChat(userIds);
      },
    });
  };

  private handleAddUser = (): void => {
    console.log('handleAddUser вызван');
    this.userSearchModal.open();
  };

  private handleCreateChat = async (userIds: number[]): Promise<void> => {
    try {
      const chatTitle = `Чат с ${userIds.length} пользователем(ями)`;
      const response = await ChatApi.createChat(chatTitle);
      if (response && response.id) {
        for (const userId of userIds) {
          await ChatApi.addUserToChat(response.id, userId);
        }
        if (this.props.onChatCreated) {
          this.props.onChatCreated(response.id);
        }
      }
    } catch (error) {
      console.error('Ошибка создания чата:', error);
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
