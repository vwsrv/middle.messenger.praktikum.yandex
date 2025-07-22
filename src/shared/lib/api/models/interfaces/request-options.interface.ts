import { IRequest } from '@/shared/lib/api/models/interfaces/request.interface.ts';
import { HTTPMethod } from '@/shared/lib/api/models/types';

export interface IRequestOptions<D = any> extends IRequest<D> {
  method?: HTTPMethod;
}
