import { ROUTES_CONFIG } from '@/app/providers/router/configs';
import Router from '@/shared/lib/routing/router/router.ts';
import { authStore } from '@/app/resources/store/auth.store.ts';

export class RouterProvider {
  private readonly router: Router;

  constructor() {
    this.router = new Router('#app');
    this.setupRoutes();
  }

  private setupRoutes(): void {
    ROUTES_CONFIG.forEach(({ path, component }) => {
      this.router.use(path, component);
    });
  }

  public canAccess(pathname: string): boolean {
    const route = ROUTES_CONFIG.find(r => r.path === pathname);
    const isAuthenticated = authStore.getIsAuth();

    if (!route) return true;

    if (route.meta?.auth && !isAuthenticated) {
      return false;
    }

    return true;
  }

  public navigateTo(pathname: string): void {
    const isAuthenticated = authStore.getIsAuth();
    const route = ROUTES_CONFIG.find(r => r.path === pathname);

    if (route?.meta?.auth && !isAuthenticated) {
      this.router.go('/');
      return;
    }

    if (route?.meta?.public && isAuthenticated && ['/', '/sign-up'].includes(pathname)) {
      this.router.go('/messenger');
      return;
    }

    this.router.go(pathname);
  }

  start(): void {
    this.router.start();
  }

  getInstance(): Router {
    return this.router;
  }
}

export const routerProvider: RouterProvider = new RouterProvider();
