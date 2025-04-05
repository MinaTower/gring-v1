import { lazy } from "react";

const Home = lazy(() => import("@/pages/home/home"));
const Signup = lazy(() => import("@/pages/user/auth/signup"));
const Login = lazy(() => import("@/pages/user/auth/login"));
const CreateRoute = lazy(() => import("@/pages/user/route/map"));

export const appRoutes = [
  { path: "/", component: Home },
  { path: "/signup", component: Signup },
  { path: "/login", component: Login },
];

export const privateRoutes = [
  { path: "/routes/create", component: CreateRoute },
];
