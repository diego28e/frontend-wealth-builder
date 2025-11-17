import {
  createRouter,
  createRootRoute,
  Route,
} from '@tanstack/react-router';

// Import your components
import App from './App'; // Your root layout
import Home from './views/Home';
import Login from './views/Login';

// 1. Create a root route
const rootRoute = createRootRoute({
  component: App,
});

// 2. Create your child routes
const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const loginRoute = new Route({
  getParentRoute: () => rootRoute, // <-- This is the corrected line
  path: '/login',
  component: Login,
});

// 3. Create the route tree
const routeTree = rootRoute.addChildren([homeRoute, loginRoute]);

// 4. Create the router instance
export const router = createRouter({ routeTree });

// 5. Register the router for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}