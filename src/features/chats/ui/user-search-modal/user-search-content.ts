import Block from '../../../../shared/lib/block/block';
import template from './user-search-content.hbs?raw';
import CombinedInput from '../../../../shared/ui/combined-input/combined-input';
import Button from '../../../../shared/ui/button/button';
import UserSearchList from './user-search-list/user-search-list';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user';

export interface IUserSearchContentProps {
  searchValue: string;
  isSearching: boolean;
  foundUsers: IFindUserResponse[];
  selectedUsers: IFindUserResponse[];
  onSearchInput: (value: string) => void;
  onSearch: () => void;
  onUserSelect: (user: IFindUserResponse) => void;
  onUserDeselect: (user: IFindUserResponse) => void;
  onCreateChat: () => void;
  isCreateDisabled: boolean;
}

class UserSearchContent extends Block {
  constructor(props: IUserSearchContentProps) {
    super('div', {
      ...props,
      className: 'user-search-modal',
      SearchInput: new CombinedInput({
        className: 'input_search',
        type: 'text',
        name: 'search',
        placeholder: 'Поиск пользователей',
        value: props.searchValue,
        onInput: props.onSearchInput,
      }),
      SearchButton: new Button({
        type: 'button',
        theme: 'primary',
        label: props.isSearching ? 'Поиск...' : 'Найти',
        disabled: props.isSearching,
        onClick: props.onSearch,
      }),
      UserSearchListComponent: new UserSearchList({
        users: props.foundUsers,
        selectedUsers: props.selectedUsers,
        onUserSelect: props.onUserSelect,
        onUserDeselect: props.onUserDeselect,
      }),
      CreateChatButton: new Button({
        type: 'button',
        theme: 'primary',
        label: 'Создать чат',
        disabled: props.isCreateDisabled,
        onClick: props.onCreateChat,
      }),
    });
  }

  render(): string {
    return template;
  }

  componentDidUpdate(
    _oldProps: IUserSearchContentProps,
    newProps: IUserSearchContentProps,
  ): boolean {
    // Обновляем значение поиска
    if (_oldProps.searchValue !== newProps.searchValue) {
      const searchInput = this.children.SearchInput as CombinedInput;
      searchInput.setProps({
        value: newProps.searchValue,
      });
    }

    // Обновляем состояние кнопки поиска
    if (_oldProps.isSearching !== newProps.isSearching) {
      const searchButton = this.children.SearchButton as Button;
      searchButton.setProps({
        label: newProps.isSearching ? 'Поиск...' : 'Найти',
        disabled: newProps.isSearching,
      });
    }

    // Обновляем список пользователей
    if (
      _oldProps.foundUsers !== newProps.foundUsers ||
      _oldProps.selectedUsers !== newProps.selectedUsers
    ) {
      const userSearchList = this.children.UserSearchListComponent as UserSearchList;
      userSearchList.setProps({
        users: newProps.foundUsers,
        selectedUsers: newProps.selectedUsers,
      });
    }

    return true;
  }
}

export default UserSearchContent;
