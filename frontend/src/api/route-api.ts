import { CreateRouteData } from "@/interface";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

export const createRoute = async (routeData: CreateRouteData) => {
  try {
    const response = await axios.post(`${API_BASE}/routes`, routeData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getListRoutes = async () => {
  try {
    const response = await axios.get(`${API_BASE}/routes`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRouteById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE}/routes/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const postRoute = async (id: string)
