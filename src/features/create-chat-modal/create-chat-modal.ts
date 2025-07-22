import Block from '../../shared/lib/block/block';
import Modal from '../../shared/ui/modal/modal';
import Button from '../../shared/ui/button/button';
import ProfileInput from '../../shared/ui/profile-input/profile-input';
import template from './create-chat-modal-content.hbs?raw';

interface ICreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (title: string) => void;
}

class CreateChatModalContent extends Block {
  private chatTitle: string = '';

  constructor(props: ICreateChatModalProps) {
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
      disabled: true,
      onClick: () => {
        this.handleCreateChat();
      },
    });

    const titleInput = new ProfileInput({
      type: 'text',
      name: 'title',
      placeholder: 'Введите название чата',
      value: '',
      onInput: (value: string) => {
        this.handleTitleChange(value);
      },
    });

    super('div', {
      ...props,
      className: 'create-chat-modal__content',
      CancelButtonComponent: cancelButton,
      CreateButtonComponent: createButton,
      TitleInputComponent: titleInput,
      chatTitle: '',
    });
  }

  public resetState(): void {
    this.chatTitle = '';
    const titleInput = this.children.TitleInputComponent as Block;
    if (titleInput) {
      titleInput.setProps({ value: '' });
    }
    this.setProps({ chatTitle: '' });
  }

  private handleTitleChange = (value: string): void => {
    console.log('CreateChatModal handleTitleChange called with value:', value);
    this.chatTitle = value;

    const createButton = this.children.CreateButtonComponent as Block;
    if (createButton) {
      createButton.setProps({ disabled: !value.trim() });
    }
  };

  private handleCreateChat = (): void => {
    if (this.chatTitle.trim()) {
      this.props.onCreateChat(this.chatTitle.trim());
    }
  };

  render(): string {
    return template;
  }
}

class CreateChatModal extends Block {
  constructor(props: ICreateChatModalProps) {
    const modalContent = new CreateChatModalContent(props);
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

  componentDidUpdate(oldProps: ICreateChatModalProps, newProps: ICreateChatModalProps): boolean {
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

export default CreateChatModal;
