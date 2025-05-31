import {EventBus} from "../event-bus";
import {TBlock} from "./types";
import Handlebars from "handlebars";

interface IBlockMeta<P extends TBlock> {
    tag: string;
    props: P;
}

abstract class Block<P extends TBlock = TBlock> {
    protected static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render"
    };

    protected _element: HTMLElement | undefined;
    protected _meta: IBlockMeta<P>;
    protected props: P;
    protected eventBus: () => EventBus;

    protected constructor(tag = "div", props: P) {
        const eventBus = new EventBus();
        this._meta = {
            tag,
            props
        };

        this.props = this._makePropsProxy(props);
        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    private _registerEvents(eventBus: EventBus): void {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _createResources(): void {
        const { tag } = this._meta;
        this._element = this._createDocumentElement(tag);
    }

    private _addEvents(): void {
        const { events } = this.props;

        if (!events || !this._element) {
            return;
        }

        Object.entries(events).forEach(([eventName, callback]) => {
            this._element?.addEventListener(eventName, callback);
        });
    }

    private _removeEvents(): void {
        const { events } = this.props;

        if (!events || !this._element) {
            return;
        }

        Object.entries(events).forEach(([eventName, callback]) => {
            this._element?.removeEventListener(eventName, callback);
        });
    }

    protected init(): void {
        console.log('Initializing block:', this.constructor.name);
        this._createResources();
        this._addEvents();
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    public destroy(): void {
        this._removeEvents();
    }

    private _componentDidMount(): void {
        this.componentDidMount();
    }

    protected componentDidMount(): void {}

    public dispatchComponentDidMount(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(): void {
        if (this.componentDidUpdate()) {
            this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
        }
    }

    protected componentDidUpdate(): boolean {
        return true;
    }

    public setProps = (nextProps: Partial<P>): void => {
        if (!nextProps) {
            return;
        }
        Object.assign(this.props, nextProps);
    };

    public get element(): HTMLElement | undefined {
        return this._element;
    }

    protected compile(template: string, props?: Record<string, unknown>): string {
        const propsAndChildren = { ...(props || {}), ...this.props };
        return Handlebars.compile(template)(propsAndChildren);
    }

    private _render(): void {
        const block = this.render();
        const compiled = Handlebars.compile(block)(this.props);
        
        if (this._element) {
            this._element.innerHTML = compiled;
        }
    }

    public abstract render(): string;

    public getContent(): HTMLElement {
        if (!this._element) {
            this._createResources();
        }
        this._render();
        return this._element!;
    }

    private _makePropsProxy(props: P): P {

        return new Proxy(props, {
            get: (target, prop: string | symbol): unknown => {
                const value = target[prop as keyof P];
                return typeof value === "function" ? value.bind(target) : value;
            },

            set: (target, prop: string | symbol, value: unknown): boolean => {
                target[prop as keyof P] = value as P[keyof P];
                this.eventBus().emit(Block.EVENTS.FLOW_CDU, {...target}, target);
                return true;
            },

            deleteProperty: (): never => {
                throw new Error("Нет доступа");
            }
        });
    }

    private _createDocumentElement(tag: string): HTMLElement {
        return document.createElement(tag);
    }

    public show(): void {
        const element = this.getContent();
        if (element) {
            element.style.display = "block";
        }
    }

    public hide(): void {
        const element = this.getContent();
        if (element) {
            element.style.display = "none";
        }
    }
}
export default Block;

