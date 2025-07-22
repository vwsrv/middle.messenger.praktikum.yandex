import { IStoreState, TGetStateFn, TSetStateFn } from '@/shared/lib/store';

/** Интерфейс стора */
export interface IStore<T extends IStoreState> {
  getState: TGetStateFn<T>;
  set: TSetStateFn<T>;
}
