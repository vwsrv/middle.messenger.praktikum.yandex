import { ROUTES_CONFIG } from '@/app/providers/router/configs';
import Router from '@/shared/lib/routing/router/router.ts';

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

  start(): void {
    this.router.start();
  }

  getInstance(): Router {
    return this.router;
  }
}

export const routerProvider: RouterProvider = new RouterProvider();
