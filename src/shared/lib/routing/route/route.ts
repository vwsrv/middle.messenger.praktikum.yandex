import { IRouting } from '@/shared/lib/routing/interfaces';
import Block from '@/shared/lib/block/block.ts';
import { TBlockConstructor } from '@/shared/lib/routing/route/types/block-constructor.type.ts';
import { TRouter } from '@/shared/lib/routing/router/types';

interface IProps {
  rootQuery: string;
  [key: string]: unknown;
}

class Route implements IRouting {
  private _path: string;
  private readonly _blockClass: TBlockConstructor;
  private _block: Block | null;
  private _props: IProps;

  constructor(path: string, view: TRouter, props: { rootQuery: string | undefined }) {
    this._path = path;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(path: string): void {
    if (this.match(path)) {
      this._path = path;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  match(path: string): boolean {
    return path === this._path;
  }

  _renderDom(query: string, block: Block) {
    const root = document.querySelector(query);
    if (!root) {
      throw new Error(`Элемент с селектором "${query}" не найден`);
    }
    root.innerHTML = '';
    root.append(block.getContent()!);
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass({});
    }

    this._renderDom(this._props.rootQuery, this._block);
    this._block.componentDidMount();
  }
}

export default Route;
