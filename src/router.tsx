import {
  createRouter,
  createRootRoute,
  createRoute,
} from '@tanstack/react-router';

import App from './App';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './views/Login';

const rootRoute = createRootRoute({
  component: App,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: AppLayout,
});

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth-layout',
  component: AuthLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: Home,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/dashboard',
  component: Dashboard,
});

const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: Login,
});

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([homeRoute, dashboardRoute]),
  authLayoutRoute.addChildren([loginRoute]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
