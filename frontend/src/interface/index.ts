import { JSX } from "react";

export interface LogUserData {
  email: string;
  password: string;
}

export interface OptionCategory {
  id: string;
  name: string;
}

export interface AuthTemplateItem {
  text: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  options?: OptionCategory[];
}

export interface AuthTemplateProps {
  title: string;
  items: AuthTemplateItem[];
  buttonText: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  showSignupLink?: boolean;
}

export interface FavoriteRoute {
  id: number;
  userId: number;
  routeId: number;
  addedAt: string;
  route: RouteDetails;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  name: string;
  favouriteCategory: string;
  favoriteRoutes?: FavoriteRoute[];
}

export interface RegUserData {
  email: string;
  name: string;
  password: string;
  category: string;
}

export interface CreateRouteData {
  name: string;
  description: string;
  category?: string;
  coordinates: [number, number][];
}

export interface WrapperTemplateProps {
  children: React.ReactNode;
}

export interface RoutesList {
  id: string;
  uuid: string;
  name: string;
  description: string;
  category: string;
}

export interface Place {
  id: number;
  uuid: string;
  name: string;
  description: string;
  rating?: number;
  coordinates?: [number, number];
  category?: string;
}

export interface PrivateRouteProps {
  children: JSX.Element;
}

export interface Review {
  id: number;
  userId: number;
  placeId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export interface RouteDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  coordinates: [number, number][];
  places?: Place[];
  createdAt: string | number | Date;
}
