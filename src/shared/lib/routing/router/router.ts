import { TRouter } from '@/shared/lib/routing/router/types';
import { IRouting } from '@/shared/lib/routing/interfaces';
import Route from '@/shared/lib/routing/route/route.ts';

class Router {
  private static __instance: Router;
  public routes: IRouting[] = [];
  private history: History = window.history;
  private _currentRoute: IRouting | null = null;
  private _rootQuery: string | undefined;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this._rootQuery = rootQuery;
    Router.__instance = this;
  }

  use(pathname: string, block: TRouter): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = (event: PopStateEvent) => {
      const target = event.currentTarget as Window;
      const pathname = target.location.pathname;
      this._onRoute(pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): IRouting | undefined {
    const route = this.routes.find(route => route.match(pathname));
    return route || this.routes.find(route => route.match('*'));
  }
}

export default Router;
