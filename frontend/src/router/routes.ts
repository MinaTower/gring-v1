import { lazy } from "react";

const Home = lazy(() => import("@/pages/home/home"));
const Signup = lazy(() => import("@/pages/user/auth/signup"));
const Login = lazy(() => import("@/pages/user/auth/login"));
// Маршруты
const RouteCreate = lazy(() => import("@/pages/user/route/create"));
const RouteDetail = lazy(() => import("@/pages/user/route/detail"));
const PersonalRoute = lazy(() => import("@/pages/user/profile/personal-route"));
// Места
const PlaceCreate = lazy(() => import("@/pages/user/place/create"));
const PlaceList = lazy(() => import("@/pages/user/place/list"));
const PlaceDetail = lazy(() => import("@/pages/user/place/detail"));

const ProfileMain = lazy(() => import("@/pages/user/profile/main"));

export const appRoutes = [
  { path: "/", component: Home },
  { path: "/signup", component: Signup },
  { path: "/login", component: Login },
  { path: "/place/list", component: PlaceList },
  { path: "/place/detail/:id", component: PlaceDetail },
  { path: "/route/detail/:id", component: RouteDetail },
];

export const privateRoutes = [
  { path: "/route/create", component: RouteCreate },
  { path: "/route/personal", component: PersonalRoute },
  { path: "/place/create", component: PlaceCreate },
  { path: "/profile/:uuid", component: ProfileMain },
];
