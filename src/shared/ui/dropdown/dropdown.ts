import Block from '../../lib/block/block';
import template from './dropdown.hbs?raw';
import DropdownItem from '../dropdown-item/dropdown-item';
import { IBlockProps } from '../../lib/block/interfaces';

interface IProps extends IBlockProps {
  className?: string;
  view?: boolean;
  onToggle?: () => void;
  DropdownItems?: DropdownItem[];
}

class Dropdown extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: `${props.className ? props.className : 'dropdown-wrapper'}`,
    });
  }

  render(): string {
    return template;
  }
}

export default Dropdown;
