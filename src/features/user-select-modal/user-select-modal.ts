import Block from '../../shared/lib/block/block';
import UserApi from '@/entities/user/api/user.api';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user';
import Modal from '../../shared/ui/modal/modal';
import Button from '../../shared/ui/button/button';
import ProfileInput from '../../shared/ui/profile-input/profile-input';
import template from './user-select-modal-content.hbs?raw';
import debounce from '@/shared/utils/debounce';

class UserSelectModalContent extends Block {
  private debouncedLoadUsers: ReturnType<typeof debounce>;
  private currentUsers: IFindUserResponse[] = [];

  constructor(props: {
    isOpen: boolean;
    onClose: () => void;
    selectedUser: IFindUserResponse | null;
    users: IFindUserResponse[];
    searchQuery: string;
    onCreateChat: (users: IFindUserResponse[]) => Promise<void>;
  }) {
    const cancelButton = new Button({
      label: 'Отмена',
      theme: 'primary',
      onClick: () => {
        this.resetState();
        props.onClose();
      },
    });

    const createButton = new Button({
      label: 'Создать чат',
      theme: 'primary',
      disabled: false,
      onClick: () => {
        this.handleCreateChat();
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
      className: 'user-select-modal__content',
      CancelButtonComponent: cancelButton,
      CreateButtonComponent: createButton,
      SearchInputComponent: searchInput,
      searchQuery: props.searchQuery || '',
      users: [],
      selectedUser: null,
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
    this.currentUsers = [];

    const searchInput = this.children.SearchInputComponent as Block;
    if (searchInput) {
      searchInput.setProps({ value: '' });
    }

    this.setProps({
      users: [],
      selectedUser: null,
      isLoading: false,
      searchQuery: '',
    });
  }

  componentDidMount(): void {
    this.loadUsers();
  }

  componentDidUpdate(
    oldProps: {
      isOpen: boolean;
      onClose: () => void;
      selectedUser: IFindUserResponse | null;
      users: IFindUserResponse[];
      searchQuery: string;
      onCreateChat: (users: IFindUserResponse[]) => Promise<void>;
    },
    newProps: {
      isOpen: boolean;
      onClose: () => void;
      selectedUser: IFindUserResponse | null;
      users: IFindUserResponse[];
      searchQuery: string;
      onCreateChat: (users: IFindUserResponse[]) => Promise<void>;
    },
  ): boolean {
    if (oldProps.selectedUser?.id !== newProps.selectedUser?.id) {
      (this.children.CreateButtonComponent as Block).setProps({
        disabled: false,
      });
    }

    return true;
  }

  private handleSearchInput = (value: string): void => {
    this.debouncedLoadUsers(value);
  };

  private async loadUsers(query: string = ''): Promise<void> {
    try {
      this.setProps({ isLoading: true });
      const users = await UserApi.searchUser({ login: query });
      this.currentUsers = Array.isArray(users) ? users : [];
      const usersWithSelection = this.currentUsers.map((user: IFindUserResponse) => ({
        ...user,
        isSelected: this.props.selectedUser?.id === user.id,
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

  private handleUserSelect = (user: IFindUserResponse): void => {
    const isSelected = this.props.selectedUser?.id === user.id;
    const selectedUser = isSelected ? null : user;
    this.setProps({ selectedUser });
    const updatedUsers = Array.isArray(this.props.users)
      ? this.props.users.map((u: IFindUserResponse) => ({
          ...u,
          isSelected: selectedUser?.id === u.id,
        }))
      : [];
    this.setProps({ users: updatedUsers });
  };

  private async handleCreateChat(): Promise<void> {
    const { selectedUser } = this.props;
    try {
      if (this.props.onCreateChat) {
        const users = selectedUser ? [selectedUser] : [];
        await this.props.onCreateChat(users);
      }
      this.props.onClose();
      this.resetState();
    } catch {}
  }

  render(): string {
    return template;
  }
}

class UserSelectModal extends Block {
  constructor(props: {
    isOpen: boolean;
    onClose: () => void;
    selectedUser: IFindUserResponse | null;
    users: IFindUserResponse[];
    searchQuery: string;
    onCreateChat: (users: IFindUserResponse[]) => Promise<void>;
  }) {
    const modalContent = new UserSelectModalContent(props);
    const modal = new Modal({
      isOpen: props.isOpen,
      content: modalContent,
      onClose: () => {
        modalContent.resetState();
        props.onClose();
      },
      status: props.isOpen ? 'opened' : 'closed',
      title: 'Создать чат',
    });
    super('div', {
      ...props,
      ModalComponent: modal,
    });
  }

  componentDidUpdate(
    oldProps: {
      isOpen: boolean;
      onClose: () => void;
      selectedUser: IFindUserResponse | null;
      users: IFindUserResponse[];
      searchQuery: string;
      onCreateChat: (users: IFindUserResponse[]) => Promise<void>;
    },
    newProps: {
      isOpen: boolean;
      onClose: () => void;
      selectedUser: IFindUserResponse | null;
      users: IFindUserResponse[];
      searchQuery: string;
      onCreateChat: (users: IFindUserResponse[]) => Promise<void>;
    },
  ): boolean {
    if (oldProps.isOpen !== newProps.isOpen) {
      const modalComponent = this.children.ModalComponent as Modal;
      if (modalComponent) {
        modalComponent.setProps({
          isOpen: newProps.isOpen,
          status: newProps.isOpen ? 'opened' : 'closed',
        });
      }
    }
    return true;
  }

  render(): string {
    return '{{{ModalComponent}}}';
  }
}

export default UserSelectModal;
