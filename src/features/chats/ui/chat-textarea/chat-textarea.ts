import Block from '../../../../shared/lib/block/block';
import template from './chat-textarea.hbs?raw';
import { IProps } from './types/types';
import Button from '../../../../shared/ui/button/button';
import CombinedInput from '../../../../shared/ui/combined-input/combined-input';
import Dropdown from '../../../../shared/ui/dropdown/dropdown';
import DropdownItem from '../../../../shared/ui/dropdown-item/dropdown-item';
import { validateField } from '@/shared/lib/validation';

class ChatTextArea extends Block {
  private messageText: string = '';
  private isAttachDropdownOpen: boolean = false;

  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'chat-textarea-wrapper',
      AttachButton: new Button({
        type: 'button',
        theme: 'attach',
        onClick: () => {
          this.toggleAttachDropdown();
        },
      }),
      AttachDropdown: new Dropdown({
        className: 'dropdown-attach',
        view: false,
        DropdownItems: [
          new DropdownItem({
            src: '/icons/photo.svg',
            name: 'Фото или Видео',
            onClick: () => {
              console.log('Прикрепить фото/видео');
              this.toggleAttachDropdown();
            },
          }),
          new DropdownItem({
            src: '/icons/file.svg',
            name: 'Файл',
            onClick: () => {
              console.log('Прикрепить файл');
              this.toggleAttachDropdown();
            },
          }),
          new DropdownItem({
            src: '/icons/location.svg',
            name: 'Локация',
            onClick: () => {
              console.log('Прикрепить локацию');
              this.toggleAttachDropdown();
            },
          }),
        ],
      }),
      MessageInput: new CombinedInput({
        className: 'input_message',
        type: 'text',
        name: 'message',
        placeholder: 'Сообщение',
        value: '',
        onInput: (value: string) => {
          this.messageText = value;
          this.updateSendButtonState();
        },
      }),
      SendButton: new Button({
        type: 'button',
        theme: 'arrow-right',
        disabled: true,
        onClick: () => {
          const messageError = validateField('message', this.messageText);

          if (!messageError && props.onSendMessage) {
            props.onSendMessage(this.messageText);
            this.messageText = '';
            this.props.MessageInput?.setProps?.({ value: '' });
            this.updateSendButtonState();
          }
        },
      }),
    });

    this.updateSendButtonState();
  }

  private updateSendButtonState(): void {
    const messageError = validateField('message', this.messageText);
    const isDisabled = !!messageError;

    const buttonChild = this.children.SendButton as Button;
    if (buttonChild && buttonChild.setProps) {
      buttonChild.setProps({ disabled: isDisabled });
    }
  }

  private toggleAttachDropdown = (): void => {
    this.isAttachDropdownOpen = !this.isAttachDropdownOpen;

    const newDropdown = new Dropdown({
      view: this.isAttachDropdownOpen,
      className: 'dropdown-attach',
      DropdownItems: [
        new DropdownItem({
          src: '/icons/dropdown-photo.icon.svg',
          name: 'Фото или Видео',
          onClick: () => {
            console.log('Прикрепить фото/видео');
            this.toggleAttachDropdown();
          },
        }),
        new DropdownItem({
          src: '/icons/dropdown-file.icon.svg',
          name: 'Файл',
          onClick: () => {
            console.log('Прикрепить файл');
            this.toggleAttachDropdown();
          },
        }),
        new DropdownItem({
          src: '/icons/dropdown-location.icon.svg',
          name: 'Локация',
          onClick: () => {
            console.log('Прикрепить локацию');
            this.toggleAttachDropdown();
          },
        }),
      ],
    });

    this.children.AttachDropdown = newDropdown;

    this.setProps({
      AttachDropdown: newDropdown,
    });

    this._render();
  };

  render(): string {
    return template;
  }
}

export default ChatTextArea;
