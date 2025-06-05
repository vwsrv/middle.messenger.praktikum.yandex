import Block from '../../shared/lib/block/block';
import { IBlockProps, TEvents } from '../../shared/lib/block/interfaces';
import Button from '../../shared/ui/button/button';
import template from './change-avatar-form.hbs?raw';

interface IProps extends IBlockProps {
  onSave?: () => void;
  onCancel?: () => void;
  events?: TEvents;
}

export class ChangeAvatarForm extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'change-avatar-form',
      SaveButton: new Button({
        label: 'Сохранить',
        type: 'button',
        theme: 'primary',
        disabled: true,
        onClick: () => {
          const fileInput = document.querySelector(
            '.change-avatar-form__input',
          ) as HTMLInputElement;
          if (fileInput?.files?.length) {
            // TODO: Обработка загрузки файла
            console.log('Upload file:', fileInput.files[0]);
            props.onSave?.();
          }
        },
      }),
      CancelButton: new Button({
        label: 'Отменить',
        type: 'button',
        theme: 'primary',
        onClick: () => {
          props.onCancel?.();
        },
      }),
      events: {
        change: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.type === 'file') {
            this.props.SaveButton?.setProps({ disabled: !target.files?.length });
          }
        },
      } as TEvents,
    });
  }

  render() {
    return template;
  }
}
