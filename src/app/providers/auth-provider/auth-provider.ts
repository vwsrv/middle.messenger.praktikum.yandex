import { authStore } from '@/app/resources/store/auth.store';
import UserApi from '@/entities/user/api/user.api';
import { router } from '@/shared/lib/routing/router/router';

export class AuthProvider {
  static async initialize(): Promise<void> {
    try {
      authStore.setLoading(true);

      const response = await UserApi.getUser();
      authStore.setUser(response);

      const currentPath = window.location.pathname;
      if (['/', '/sign-up'].includes(currentPath)) {
        router.go('/messenger');
      }
    } catch (error) {
      console.log(error);
      authStore.resetUser();
    } finally {
      authStore.setLoading(false);
    }
  }

  static canAccessRoute(pathname: string): boolean {
    const isAuthenticated = authStore.getIsAuth();

    if (pathname.startsWith('/messenger') || pathname.startsWith('/settings')) {
      return isAuthenticated;
    }

    return true;
  }
}
