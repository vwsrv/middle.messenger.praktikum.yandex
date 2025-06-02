import Block from '../../lib/block/block';
import { TButton } from './types';
import template from './button.hbs?raw';
import { registerComponent } from "../../lib";
import { IBlockProps } from '../../lib/block/types';

export interface IProps extends IBlockProps {
    label?: string;
    type?: 'button' | 'submit' | 'reset';
    theme?: TButton;
    className?: string;
    onClick?: () => void;
}

class Button extends Block {
  constructor(props: IProps) {
    super('button', props);
  }

  public init(): void {
    this._element?.setAttribute('type', this.props.type || 'button');
    this._element?.addEventListener('click', this.props.onClick || (() => {}));
  }

  public render(): string {
    return template;
  }
}

registerComponent({
    name: 'Button',
    Component: Button
});

export default Button;
