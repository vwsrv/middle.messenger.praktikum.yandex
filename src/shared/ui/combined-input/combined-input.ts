import Block from '../../lib/block/block.ts';
import { TInput } from './types';
import { IBlockProps } from '../../lib/block/interfaces';
import template from './combined-input.hbs?raw';

interface IProps extends IBlockProps {
  className?: `input_${TInput}`;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  error?: string;
  onInput: (value: string) => void;
}

class CombinedInput extends Block {
  constructor(props: IProps) {
    super('div', {
      ...props,
      className: `input_${props.className}`,
      events: {
        input: (...args: unknown[]) => {
          const e = args[0] as Event;
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.props.onInput?.(value);
        },
      },
    });
  }

  public render(): string {
    return template;
  }
}

export default CombinedInput;
