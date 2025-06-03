import Block from '../../lib/block/block';
import { IBlockProps } from '../../lib/block/interfaces';

import template from './profile-input.hbs?raw';
import { TProfileInput, TInputType, VALIDATION_RULES } from './types';

interface IProps extends IBlockProps {
  type: TInputType;
  name: string;
  placeholder: string;
  value?: string;
  className?: TProfileInput;
  error?: string;
  onInput?: (value: string) => void;
}

class ProfileInput extends Block {
  private inputValue: string;
  private inputError: string;

  constructor(props: IProps) {
    super('div', {
      ...props,
      className: 'input__container',
      events: {
        input: (...args: unknown[]) => {
          const e = args[0] as Event;
          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.inputValue = value;
          this.inputError = this.validate(value);

          const errorElement = this.element?.querySelector('.input__error') as HTMLElement;
          if (errorElement) {
            errorElement.textContent = this.inputError;
            errorElement.style.display = this.inputError ? 'block' : 'none';
          }

          if (this.props.onInput) {
            this.props.onInput(value);
          }
        },
      },
    });

    this.inputValue = props.value || '';
    this.inputError = props.error || '';
  }

  componentDidUpdate(oldProps: IBlockProps, newProps: IBlockProps): boolean {
    if (oldProps.value !== newProps.value || oldProps.error !== newProps.error) {
      this.inputValue = newProps.value as string;
      this.inputError = newProps.error as string;

      const input = this.element?.querySelector('input') as HTMLInputElement;
      if (input && input.value !== this.inputValue) {
        input.value = this.inputValue;
      }

      const errorElement = this.element?.querySelector('.input__error') as HTMLElement;
      if (errorElement) {
        errorElement.textContent = this.inputError;
        errorElement.style.display = this.inputError ? 'block' : 'none';
      }
    }
    return false;
  }

  private validate(value: string): string {
    const rule = VALIDATION_RULES[this.props.name];

    if (!rule) {
      return '';
    }

    if (!value.trim()) {
      return '';
    }

    const isValid = rule.pattern.test(value);
    return isValid ? '' : rule.message;
  }

  public getValue(): string {
    return this.inputValue;
  }

  public getError(): string {
    return this.inputError;
  }

  public render(): string {
    return template;
  }
}

export default ProfileInput;
