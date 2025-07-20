import Block from '../../../../../../shared/lib/block/block';
import template from './user-search-item.hbs?raw';
import { IProps } from './types';
import Button from '../../../../../../shared/ui/button/button';
import ProfileAvatar from '../../../../../../shared/ui/profile-avatar/profile-avatar';

class UserSearchItem extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'user-search-item',
      ProfileAvatarComponent: new ProfileAvatar({
        type: 'small',
        url: props.user.avatar,
        name: props.user.display_name,
      }),
      SelectButton: new Button({
        type: 'button',
        theme: props.isSelected ? 'close' : 'primary',
        label: props.isSelected ? 'Убрать' : 'Добавить',
        onClick: () => {
          if (props.isSelected) {
            props.onUserDeselect(props.user);
          } else {
            props.onUserSelect(props.user);
          }
        },
      }),
    });
  }

  componentDidUpdate(oldProps: IProps, newProps: IProps): boolean {
    if (oldProps.isSelected !== newProps.isSelected) {
      const selectButton = this.children.SelectButton as Button;
      if (selectButton) {
        selectButton.setProps({
          theme: newProps.isSelected ? 'close' : 'primary',
          label: newProps.isSelected ? 'Убрать' : 'Добавить',
        });
      }
    }
    return true;
  }

  render(): string {
    return template;
  }
}

export default UserSearchItem;
