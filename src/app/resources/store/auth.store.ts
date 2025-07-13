import { Store } from '@/shared/lib/store';
import { IAuthStore } from '@/app/resources/interfaces/auth-store.interface.ts';
import { IUserDataResponse } from '@/entities/user/models/interfaces/user-data';
import UserApi from '@/entities/user/api/user.api';

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

  getUser(): IUserDataResponse | null {
    return this.getState().user;
  }

  updateUser(userData: Partial<IUserDataResponse>): void {
    const currentUser = this.getState().user;
    if (currentUser) {
      this.setUser({ ...currentUser, ...userData });
    }
  }

  async loadUser(): Promise<void> {
    try {
      this.setLoading(true);
      const user = await UserApi.getUser();
      this.setUser(user);
    } catch (error) {
      console.error('Ошибка загрузки пользователя:', error);
    } finally {
      this.setLoading(false);
    }
  }
}

export const authStore = new AuthStore();
export default AuthStore;
