import { IUserDataResponse } from '@/entities/user/models/interfaces/user-data';
import { IStoreState } from '@/shared/lib/store';

export interface IAuthStore extends IStoreState {
  isAuth: boolean;
  user: IUserDataResponse | null;
  isLoading: boolean;
}
