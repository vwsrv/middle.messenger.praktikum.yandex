import EventBus from '@/shared/lib/event-bus/event-bus';
import { TStoreEvents } from './enums';
import { IStore } from './interfaces';
import { IStoreState } from './types';

/**
 * Класс стора для управления глобальным состоянием приложения
 */
export class Store<T extends IStoreState> extends EventBus implements IStore<T> {
  private static __instance: Store<any> | null = null;
  private state!: T;

  /**
   * Создает экземпляр стора
   */
  constructor(defaultState: T) {
    if (Store.__instance) {
      return Store.__instance as Store<T>;
    }

    super();
    this.state = defaultState;
    this.set(defaultState);
    Store.__instance = this;
  }

  /**
   * Получает текущее состояние стора
   */
  public getState(): T {
    return this.state;
  }

  /**
   * Устанавливает новое состояние стора
   */
  public set(nextState: Partial<T>): void {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...nextState };
    this.emit(TStoreEvents.Updated, prevState, nextState);
  }
}

export default Store;
