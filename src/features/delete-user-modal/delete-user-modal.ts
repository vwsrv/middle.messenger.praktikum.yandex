import Block from '../../shared/lib/block/block';
import Modal from '@/shared/ui/modal/modal';
import template from './delete-user-modal-content.hbs?raw';
import Button from '@/shared/ui/button';
import { ChatApi } from '@/entities/chat/api/chat.api';
import { IFindUserResponse } from '@/entities/user/models/interfaces/find-user/find-user-response.interface';
import { authStore } from '@/app/resources/store/auth.store';
import { LocalStorage } from '@/shared/utils/local-storage';

interface IDeleteUserModalProps {
  isOpen: boolean;
  activeChatId: string | undefined;
  onClose: () => void;
  onUserDeleted?: (userId: number) => void;
  onSystemMessage?: (systemMessage: any) => void;
}

class DeleteUserModalContent extends Block {
  private selectedUserId: number | null = null;
  private users: IFindUserResponse[] = [];

  constructor(props: IDeleteUserModalProps) {
    const cancelButton = new Button({
      label: 'Отмена',
      theme: 'primary',
      onClick: () => {
        this.resetState();
        props.onClose();
      },
    });
    const deleteButton = new Button({
      label: 'Удалить',
      theme: 'primary',
      disabled: true,
      onClick: () => {
        this.handleDeleteUser();
      },
    });
    super('div', {
      ...props,
      className: 'delete-user-modal__content',
      users: [],
      CancelButtonComponent: cancelButton,
      DeleteButtonComponent: deleteButton,
      events: {
        click: (...args: unknown[]) => {
          const e = args[0] as MouseEvent;
          e.preventDefault();
          const target = e.target as HTMLElement;
          const userItem = target.closest('.user-item');
          if (userItem) {
            const userId = userItem.getAttribute('data-user-id');
            if (userId) {
              this.handleUserSelect(Number(userId));
            }
          }
        },
      },
    });
    this.loadUsers();
  }

  componentDidUpdate(oldProps: IDeleteUserModalProps, newProps: IDeleteUserModalProps): boolean {
    if ((!oldProps.isOpen && newProps.isOpen) || oldProps.activeChatId !== newProps.activeChatId) {
      this.loadUsers();
      this.selectedUserId = null;
    }
    return true;
  }

  private async loadUsers() {
    const { activeChatId } = this.props as IDeleteUserModalProps;
    if (!activeChatId) return;
    try {
      const users = await ChatApi.getChatUsers(Number(activeChatId));
      const currentUser = authStore.getUser();
      this.users = users.filter(u => !currentUser || u.id !== currentUser.id);
      this.updateUserItems();
    } catch {
      this.setProps({ users: [] });
    }
  }

  private updateUserItems() {
    const usersWithSelection = this.users.map(user => ({
      ...user,
      isSelected: this.selectedUserId === user.id,
    }));
    this.setProps({ users: usersWithSelection });
    const deleteButton = this.children.DeleteButtonComponent as Block;
    if (deleteButton) {
      deleteButton.setProps({ disabled: this.selectedUserId === null });
    }
  }

  private handleUserSelect(userId: number) {
    this.selectedUserId = this.selectedUserId === userId ? null : userId;
    this.updateUserItems();
  }

  public resetState(): void {
    this.selectedUserId = null;
    this.updateUserItems();
  }

  private async handleDeleteUser(): Promise<void> {
    const { activeChatId, onUserDeleted, onSystemMessage, onClose } = this
      .props as IDeleteUserModalProps;
    if (!this.selectedUserId || !activeChatId) return;
    try {
      await ChatApi.removeUserFromChat(Number(activeChatId), this.selectedUserId);
      if (onUserDeleted) {
        onUserDeleted(this.selectedUserId);
      }
      const user = this.users.find(u => u.id === this.selectedUserId);
      const userName =
        user?.display_name || `${user?.first_name || ''} ${user?.second_name || ''}`.trim();
      const systemMsg = {
        id: `system_remove_${Date.now()}_${this.selectedUserId}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'user_left',
        content: `Пользователь удалён: ${userName}`,
        timestamp: Date.now(),
      };
      if (onSystemMessage) {
        onSystemMessage(systemMsg);
      }
      // Сохраняем системное сообщение в LocalStorage
      if (activeChatId) {
        LocalStorage.addSystemMessage(activeChatId, systemMsg);
      }
      onClose();
      this.resetState();
    } catch {
      alert('Ошибка при удалении пользователя');
    }
  }

  render(): string {
    return template;
  }
}

class DeleteUserModal extends Block {
  private modalContent: DeleteUserModalContent;

  constructor(props: IDeleteUserModalProps) {
    const modalContent = new DeleteUserModalContent(props);
    const modal = new Modal({
      isOpen: props.isOpen,
      content: modalContent,
      onClose: () => {
        modalContent.resetState();
        props.onClose();
      },
      status: props.isOpen ? 'opened' : 'closed',
      title: 'Удалить пользователя',
    });
    super('div', {
      ...props,
      ModalComponent: modal,
    });
    this.modalContent = modalContent;
  }

  componentDidUpdate(oldProps: IDeleteUserModalProps, newProps: IDeleteUserModalProps): boolean {
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

export default DeleteUserModal;
