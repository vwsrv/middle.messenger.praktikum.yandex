import Block from "../../lib/block/block";
import { TBlock } from "../../lib";
import template from './chat-preview.hbs?raw';

interface IProps extends TBlock {
  id: string | number;
  time: string;
  name: string;
  message: string;
  count: number | string;
  avatarSrc: string;
  avatarName: string;
  events?: {
    click?: () => void;
  };
}

class ChatPreview extends Block<TBlock> {
  constructor(props: IProps) {
    super('div', props);
  }

  protected render(): string {
    return template;
  }
}

export default ChatPreview;
