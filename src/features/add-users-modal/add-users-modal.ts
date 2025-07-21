import Block from '../../shared/lib/block/block';
import UserApi from '@/entities/user/api/user.api';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user';
import Modal from '../../shared/ui/modal/modal';
import Button from '../../shared/ui/button/button';
import ProfileInput from '../../shared/ui/profile-input/profile-input';
import template from './add-users-modal-content.hbs?raw';
import debounce from '@/shared/utils/debounce';
import './style.css';

interface IAddUsersModalProps {
  isOpen: boolean;
  activeChatId?: string;
  searchQuery?: string;
  selectedUsers?: IFindUserResponse[];
  onClose: () => void;
  onAddUsersToChat: (users: any[]) => Promise<void>;
  onUserAddedToChat?: (chatId: number, userId: number) => Promise<void>;
  onSystemMessage?: (systemMessage: any) => void;
}

class AddUsersModalContent extends Block {
  private debouncedLoadUsers: ReturnType<typeof debounce>;
  private currentSearchQuery: string = '';
  private currentUsers: IFindUserResponse[] = [];
  private isLoading: boolean = false;
  private selectedUsers: IFindUserResponse[] = [];

  constructor(props: IAddUsersModalProps) {
    const cancelButton = new Button({
      label: 'Отмена',
      theme: 'primary',
      onClick: () => {
        this.resetState();
        props.onClose();
      },
    });

    const addButton = new Button({
      label: 'Добавить пользователей',
      theme: 'primary',
      disabled: true,
      onClick: () => {
        this.handleAddUsers();
      },
    });

    const searchInput = new ProfileInput({
      type: 'text',
      name: 'search',
      placeholder: 'Поиск пользователей...',
      value: '',
      onInput: (value: string) => {
        this.handleSearchInput(value);
      },
    });

    super('div', {
      ...props,
      className: 'add-users-modal__content',
      CancelButtonComponent: cancelButton,
      AddButtonComponent: addButton,
      SearchInputComponent: searchInput,
      searchQuery: props.searchQuery || '',
      users: [],
      selectedUsers: [],
      isLoading: false,
      events: {
        click: (...args: unknown[]) => {
          const e = args[0] as MouseEvent;
          e.preventDefault();
          const target = e.target as HTMLElement;
          const userItem = target.closest('.user-item');
          if (userItem) {
            const userId = userItem.getAttribute('data-user-id');
            const user = this.currentUsers.find((u: IFindUserResponse) => u.id === Number(userId));
            if (user) {
              this.handleUserSelect(user);
            }
          }
        },
      },
    });

    this.debouncedLoadUsers = debounce(this.loadUsers.bind(this), { delay: 500 });
  }

  public resetState(): void {
    this.currentSearchQuery = '';
    this.currentUsers = [];
    this.selectedUsers = [];
    this.isLoading = false;

    const searchInput = this.children.SearchInputComponent as Block;
    if (searchInput) {
      searchInput.setProps({ value: '' });
    }

    this.setProps({
      users: [],
      selectedUsers: [],
      isLoading: false,
      searchQuery: '',
    });
  }

  componentDidMount(): void {
    this.loadUsers();
  }

  componentDidUpdate(oldProps: IAddUsersModalProps, newProps: IAddUsersModalProps): boolean {
    if (oldProps.selectedUsers?.length !== newProps.selectedUsers?.length) {
      (this.children.AddButtonComponent as Block).setProps({
        disabled: newProps.selectedUsers?.length === 0,
      });
    }
    return true;
  }

  private async loadUsers(query: string = ''): Promise<void> {
    try {
      this.setProps({ isLoading: true });
      const users = await UserApi.searchUser({ login: query });
      this.currentUsers = Array.isArray(users) ? users : [];
      const usersWithSelection = this.currentUsers.map((user: IFindUserResponse) => ({
        ...user,
        isSelected: this.selectedUsers.some(selectedUser => selectedUser.id === user.id),
      }));
      this.setProps({
        users: usersWithSelection,
        isLoading: false,
        searchQuery: query,
      });
    } catch {
      this.setProps({
        isLoading: false,
        users: [],
        searchQuery: query,
      });
    }
  }

  private handleSearchInput = (value: string): void => {
    this.currentSearchQuery = value;
    this.debouncedLoadUsers(value);
  };

  private handleUserSelect = (user: IFindUserResponse): void => {
    const isSelected = this.selectedUsers.some(selectedUser => selectedUser.id === user.id);
    if (isSelected) {
      this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
    } else {
      this.selectedUsers = [...this.selectedUsers, user];
    }
    this.setProps({ selectedUsers: this.selectedUsers });
    const updatedUsers = Array.isArray(this.props.users)
      ? this.props.users.map((u: IFindUserResponse) => ({
          ...u,
          isSelected: this.selectedUsers.some(selectedUser => selectedUser.id === u.id),
        }))
      : [];
    this.setProps({ users: updatedUsers });
    const addButton = this.children.AddButtonComponent as Block;
    if (addButton) {
      addButton.setProps({ disabled: this.selectedUsers.length === 0 });
    }
  };

  private async handleAddUsers(): Promise<void> {
    if (this.selectedUsers.length === 0) {
      return;
    }
    try {
      if (this.props.onAddUsersToChat) {
        await this.props.onAddUsersToChat(this.selectedUsers);
      }
      this.props.onClose();
      this.resetState();
    } catch {}
  }

  render(): string {
    return template;
  }
}

class AddUsersModal extends Block {
  private modalContent: AddUsersModalContent;

  constructor(props: IAddUsersModalProps) {
    const modalContent = new AddUsersModalContent(props);
    const modal = new Modal({
      isOpen: props.isOpen,
      content: modalContent,
      onClose: () => {
        modalContent.resetState();
        props.onClose();
      },
      status: props.isOpen ? 'opened' : 'closed',
      title: 'Добавить пользователей',
    });
    super('div', {
      ...props,
      ModalComponent: modal,
    });
    this.modalContent = modalContent;
  }

  componentDidUpdate(oldProps: IAddUsersModalProps, newProps: IAddUsersModalProps): boolean {
    if (oldProps.isOpen !== newProps.isOpen) {
      const modalComponent = this.children.ModalComponent as Modal;
      if (modalComponent) {
        modalComponent.setProps({
          isOpen: newProps.isOpen,
          status: newProps.isOpen ? 'opened' : 'closed',
        });
      }
    }
    if (oldProps.activeChatId !== newProps.activeChatId || oldProps.isOpen !== newProps.isOpen) {
      this.modalContent.setProps(newProps);
    }
    return true;
  }

  render(): string {
    return '{{{ModalComponent}}}';
  }
}

export default AddUsersModal;
