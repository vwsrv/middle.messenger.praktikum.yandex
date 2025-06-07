import Handlebars from 'handlebars';
import { nanoid } from 'nanoid';
import EventBus from '../event-bus/event-bus';
import { IBlockProps, TChildren } from './interfaces';
import { IMeta } from '@/shared/lib';

class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  _element: HTMLElement | null = null;
  _meta: IMeta | null = null;
  _id: string = nanoid(6);
  protected children: TChildren = {};
  protected props: IBlockProps = {};
  protected eventBus: () => EventBus;

  /** JSDoc
   * @param {string} tagName
   * @param propsWithChildren
   *
   * @returns {void}
   */
  constructor(tagName: string = 'div', propsWithChildren: IBlockProps = {}) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;

    const { props, children } = this._getChildrenAndProps(propsWithChildren);
    this.children = children;

    this._meta = {
      tagName,
      props,
    };

    this.props = this._makePropsProxy(props);

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources(): void {
    if (!this._meta) {
      return;
    }

    const { tagName, props } = this._meta;
    const fragment = this._compile();
    this._element = document.createElement(tagName);

    if (typeof props.className === 'string') {
      const classes = props.className.split(' ');
      this._element.classList.add(...classes);
    }

    if (typeof props.attrs === 'object') {
      Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
        if (this._element) {
          this._element.setAttribute(attrName, attrValue);
        }
      });
    }

    // Обработка стандартных HTML атрибутов
    if (props.disabled !== undefined && this._element) {
      if (props.disabled) {
        this._element.setAttribute('disabled', 'true');
      } else {
        this._element.removeAttribute('disabled');
      }
    }

    if (props.type !== undefined && this._element) {
      this._element.setAttribute('type', props.type as string);
    }

    if (this._element) {
      if (this._element.tagName === 'BUTTON') {
        this._element.textContent = '';
      }
      this._element.appendChild(fragment);
    }
  }

  init(): void {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  _getChildrenAndProps(propsAndChildren: IBlockProps): { props: IBlockProps; children: TChildren } {
    const children: TChildren = {};
    const props: IBlockProps = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(obj => {
          if (obj instanceof Block) {
            if (!children[key]) {
              children[key] = [];
            }
            (children[key] as Block[]).push(obj);
          } else {
            props[key] = value;
          }
        });

        return;
      }
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  _componentDidMount(): void {
    this.componentDidMount();
  }

  componentDidMount(): void {}

  dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps: IBlockProps, newProps: IBlockProps): void {
    const response = this.componentDidUpdate(oldProps, newProps);

    if (!response) {
      return;
    }

    const hasNonEventPropsChanged = Object.entries(newProps).some(([key, value]) => {
      if (key === 'events') return false;
      return oldProps[key] !== value;
    });

    if (hasNonEventPropsChanged) {
      this._render();
    }
  }

  componentDidUpdate(_oldProps: IBlockProps, _newProps: IBlockProps): boolean {
    return true;
  }

  setProps = (nextProps: IBlockProps): void => {
    if (!nextProps) {
      return;
    }

    const oldProps = { ...this.props };
    Object.assign(this.props, nextProps);
    this.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, this.props);
  };

  get element(): HTMLElement | null {
    return this._element;
  }

  _addEvents(): void {
    const { events = {} } = this.props;

    Object.entries(events).forEach(([eventName, handler]) => {
      if (handler && typeof handler === 'function') {
        this._element!.addEventListener(eventName, handler as EventListener);
      }
    });
  }

  _removeEvents(): void {
    const { events = {} } = this.props;

    Object.entries(events).forEach(([eventName, handler]) => {
      if (handler && typeof handler === 'function') {
        this._element!.removeEventListener(eventName, handler as EventListener);
      }
    });
  }

  _compile(): DocumentFragment {
    const propsAndStubs = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(component => `<div data-id="${component._id}"></div>`);
      } else {
        propsAndStubs[key] = `<div data-id="${(child as Block)._id}"></div>`;
      }
    });

    const fragment = this._createDocumentElement('template') as HTMLTemplateElement;
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(component => {
          const stub = fragment.content.querySelector(`[data-id="${component._id}"]`);

          stub?.replaceWith(component.getContent()!);
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${(child as Block)._id}"]`);

        stub?.replaceWith((child as Block).getContent()!);
      }
    });

    return fragment.content;
  }

  _render(): void {
    if (!this._element) {
      return;
    }

    this._removeEvents();

    if (this.props.disabled !== undefined) {
      if (this.props.disabled) {
        this._element.setAttribute('disabled', 'true');
      } else {
        this._element.removeAttribute('disabled');
      }
    }

    if (this.props.type !== undefined) {
      this._element.setAttribute('type', this.props.type as string);
    }

    const block = this._compile();

    if (this._element.tagName === 'BUTTON') {
      this._element.textContent = '';
      this._element.appendChild(block);
    } else if (this._element.children.length === 0) {
      this._element.appendChild(block);
    } else {
      this._element.replaceChildren(block);
    }

    this._addEvents();
  }

  render(): string {
    return '';
  }

  getContent(): HTMLElement | null {
    return this.element;
  }

  _makePropsProxy(props: IBlockProps): IBlockProps {
    const eventBus = this.eventBus();
    const emitBind = eventBus.emit.bind(eventBus);

    return new Proxy(props, {
      get(target: Record<string, unknown>, prop: string): unknown {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: Record<string, unknown>, prop: string, value: unknown): boolean {
        const oldTarget = { ...target };
        target[prop] = value;

        // Запускаем обновление компоненты
        // Плохой cloneDeep, в следующей итерации нужно заставлять добавлять cloneDeep им самим
        emitBind(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty(): never {
        throw new Error('Нет доступа');
      },
    });
  }

  _createDocumentElement(tagName: string): HTMLElement {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }

  show(): void {
    const element = this.getContent();
    if (element) {
      element.style.display = 'block';
    }
  }

  hide(): void {
    const element = this.getContent();
    if (element) {
      element.style.display = 'none';
    }
  }
}

export default Block;
