import Block from '../../../../../shared/lib/block/block';
import template from './user-search-list.hbs?raw';
import { IProps } from './types';
import UserSearchItem from './user-search-item/user-search-item';

class UserSearchList extends Block {
  constructor(props: IProps) {
    console.log('UserSearchList constructor с users:', props.users);
    const userItems = props.users.map(
      user =>
        new UserSearchItem({
          user,
          isSelected: props.selectedUsers.some(selectedUser => selectedUser.id === user.id),
          onUserSelect: props.onUserSelect,
          onUserDeselect: props.onUserDeselect,
        }),
    );

    super('div', {
      ...props,
      className: 'user-search-list',
      UserItems: userItems,
    });
  }

  componentDidUpdate(oldProps: IProps, newProps: IProps): boolean {
    if (oldProps.users !== newProps.users || oldProps.selectedUsers !== newProps.selectedUsers) {
      const userItems = newProps.users.map(
        user =>
          new UserSearchItem({
            user,
            isSelected: newProps.selectedUsers.some(selectedUser => selectedUser.id === user.id),
            onUserSelect: newProps.onUserSelect,
            onUserDeselect: newProps.onUserDeselect,
          }),
      );

      this.children.UserItems = userItems;
      this.setProps({ UserItems: userItems });
    }
    return true;
  }

  render(): string {
    return template;
  }
}

export default UserSearchList;
