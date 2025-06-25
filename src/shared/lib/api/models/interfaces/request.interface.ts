import { IHeaders } from '@/shared/lib/api/models/interfaces/headers.interface.ts';

export interface IRequest<D = any> {
  headers?: IHeaders;
  data?: D;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: XMLHttpRequestResponseType;
}
