import {
  createRouter,
  createRootRoute,
  createRoute,
} from "@tanstack/react-router";

import App from "./App";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Transactions from "./views/Transactions";
import Goals from "./views/Goals";
import Accounts from "./views/Accounts";
import Login from "./views/Login";
import Register from "./views/Register";

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

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: ()=> {
    return (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    )
  }
})

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
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard",
  component: Dashboard,
});

const transactionsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/transactions",
  component: Transactions,
});

const goalsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/goals",
  component: Goals,
});

const accountsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/accounts",
  component: Accounts,
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



const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([homeRoute, dashboardRoute]),
  authLayoutRoute.addChildren([loginRoute, registerRoute]),
  dashboardLayoutRoute.addChildren([dashboardRoute, transactionsRoute, goalsRoute, accountsRoute])
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
