/** Базовое состояние стора */
export interface IStoreState {
  [key: string]: unknown;
}

/** Тип функции установки состояния */
export type TSetStateFn<T extends IStoreState> = (nextState: Partial<T>) => void;

/** Тип функции получения состояния */
export type TGetStateFn<T extends IStoreState> = () => T;
