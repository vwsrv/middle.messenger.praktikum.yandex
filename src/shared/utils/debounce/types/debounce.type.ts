export type TDebounceFunction<T extends (...args: any[]) => any> = T;

export interface IDebounceOptions {
  delay: number;
}
