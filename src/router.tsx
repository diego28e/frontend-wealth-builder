import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";

import App from "./App";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Login from "./views/Login";
import Register from "./views/Register";
import About from "./views/About";
import { ProtectedRoute} from './components/ProtectedRoute';

const rootRoute = createRootRoute({
  component: App,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app-layout",
  component:()=> (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  ),
});

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth-layout",
  component: AuthLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: Home,
});

const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/dashboard",
  component: Dashboard,
});

const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/register",
  component: Register,
});

const aboutRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/about",
  component: About,
});

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([homeRoute, dashboardRoute, aboutRoute]),
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
