import Block from '../../../../shared/lib/block/block';
import { IProps } from './types';
import Modal from '../../../../shared/ui/modal/modal';
import UserSearchContent from './user-search-content';
import UserApi from '@/entities/user/api/user.api';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user';

class UserSearchModal extends Block {
  private searchQuery: string = '';
  private foundUsers: IFindUserResponse[] = [];
  private selectedUsers: IFindUserResponse[] = [];
  private isSearching: boolean = false;

  constructor(props: IProps) {
    const content = new UserSearchContent({
      searchValue: '',
      isSearching: false,
      foundUsers: [],
      selectedUsers: [],
      onSearchInput: () => {},
      onSearch: () => {},
      onUserSelect: () => {},
      onUserDeselect: () => {},
      onCreateChat: () => {},
      isCreateDisabled: true,
    });

    super('div', {
      ...props,
      ModalComponent: new Modal({
        isOpen: false,
        status: 'closed',
        content,
        onClose: () => {},
        onSubmit: () => {},
        children: {
          SaveButton: new Block('div', {}),
          CancelButton: new Block('div', {}),
        },
        title: 'Поиск пользователей',
        type: 'default',
      }),
    });
    this.children.UserSearchContent = content;
    this.initializeCallbacks();
  }

  private initializeCallbacks = (): void => {
    const content = this.children.UserSearchContent as UserSearchContent;
    const modalComponent = this.children.ModalComponent as Modal;

    if (content) {
      content.setProps({
        onSearchInput: (value: string) => this.handleSearchInput(value),
        onSearch: () => this.handleSearch(),
        onUserSelect: (user: IFindUserResponse) => this.handleUserSelect(user),
        onUserDeselect: (user: IFindUserResponse) => this.handleUserDeselect(user),
        onCreateChat: () => this.handleCreateChat(),
      });
    }

    if (modalComponent) {
      modalComponent.setProps({
        onClose: () => this.handleClose(),
        onSubmit: () => this.handleCreateChat(),
      });
    }
  };

  private updateContentProps = (): void => {
    const content = this.children.UserSearchContent as UserSearchContent;
    content.setProps({
      searchValue: this.searchQuery,
      isSearching: this.isSearching,
      foundUsers: this.foundUsers,
      selectedUsers: this.selectedUsers,
      isCreateDisabled: this.selectedUsers.length === 0,
    });
  };

  private handleSearchInput = (value: string): void => {
    console.log('handleSearchInput вызван с значением:', value);
    this.searchQuery = value;
    this.updateContentProps();
  };

  private handleSearch = async (): Promise<void> => {
    console.log('handleSearch вызван, searchQuery:', this.searchQuery);
    if (!this.searchQuery.trim()) {
      console.log('Поисковый запрос пустой');
      this.foundUsers = [];
      this.updateContentProps();
      return;
    }

    try {
      console.log('Начинаем поиск...');
      this.isSearching = true;
      this.updateContentProps();

      const response = await UserApi.searchUser({ login: this.searchQuery });
      console.log('Результат поиска:', response);
      this.foundUsers = Array.isArray(response) ? response : [response];
    } catch (error) {
      console.error('Ошибка поиска:', error);
      this.foundUsers = [];
    } finally {
      this.isSearching = false;
      this.updateContentProps();
    }
  };

  private handleUserSelect = (user: IFindUserResponse): void => {
    if (!this.selectedUsers.some(u => u.id === user.id)) {
      this.selectedUsers.push(user);
      this.updateContentProps();
    }
  };

  private handleUserDeselect = (user: IFindUserResponse): void => {
    this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    this.updateContentProps();
  };

  private handleCreateChat = async (): Promise<void> => {
    if (this.selectedUsers.length === 0) return;

    try {
      const userIds = this.selectedUsers.map(u => u.id);
      if (this.props.onCreateChat) {
        await this.props.onCreateChat(userIds);
      }
      this.handleClose();
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  };

  private handleClose = (): void => {
    this.searchQuery = '';
    this.foundUsers = [];
    this.selectedUsers = [];
    this.isSearching = false;

    this.updateContentProps();
    this.props.onClose?.();
  };

  public open = (): void => {
    const modalComponent = this.children.ModalComponent as Modal;
    if (modalComponent) {
      modalComponent.setProps({ isOpen: true, status: 'opened' });
      this.initializeCallbacks();
    }
  };

  public close = (): void => {
    const modalComponent = this.children.ModalComponent as Modal;
    if (modalComponent) {
      modalComponent.setProps({ isOpen: false, status: 'closed' });
    }
    this.handleClose();
  };

  render(): string {
    return '{{{ModalComponent}}}';
  }
}

export default UserSearchModal;
