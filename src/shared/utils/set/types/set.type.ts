import { TMerge } from '@/shared/utils/merge/types';

export type TSet = {
  object: TMerge | unknown;
  path: string;
  value: unknown;
};
