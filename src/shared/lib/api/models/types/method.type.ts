import { METHODS } from '@/shared/lib/api/constants';

export type HTTPMethod = (typeof METHODS)[keyof typeof METHODS];
