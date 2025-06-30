import { Store } from '@/shared/lib/store';
import { IAuthStore } from '@/app/resources/interfaces/auth-store.interface.ts';
import { IUserDataResponse } from '@/entities/user/models/interfaces/user-data';

const INITIAL_STATE: IAuthStore = {
  isAuth: false,
  user: null,
  isLoading: false,
};

class AuthStore extends Store<IAuthStore> {
  constructor() {
    super(INITIAL_STATE);
  }

  setUser(user: IUserDataResponse) {
    this.set({ user, isAuth: true });
  }

  resetUser(): void {
    this.set({ user: null, isAuth: false });
  }

  setLoading(isLoading: boolean): void {
    this.set({ isLoading });
  }

  getIsAuth(): boolean {
    return this.getState().isAuth;
  }
}

export const authStore = new AuthStore();
export default AuthStore;
