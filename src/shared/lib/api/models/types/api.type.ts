import { IRequestOptions } from '@/shared/lib/api/models/interfaces/request-options.interface';

export type TMethod = <R = unknown>(url: string, options?: IRequestOptions) => Promise<R>;
