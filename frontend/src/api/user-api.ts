import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

export const registUser = async (
  email: string,
  name: string,
  category: string,
  password: string,
) => {
  try {
    const response = await axios.post(`${API_BASE}/signup`, {
      email,
      name,
      favouriteCategory: category,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const detailUser = async (username: string) => {
  try {
    const response = await axios.get(`${API_BASE}/profile/${username}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE}/categories`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addRouteToFavorites = async (userId: number, routeId: number) => {
  try {
    const response = await axios.post(`${API_BASE}/favorites`, {
      userId,
      routeId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeRouteFromFavorites = async (
  userId: number,
  routeId: number,
) => {
  try {
    const response = await axios.delete(`${API_BASE}/favorites`, {
      data: { userId, routeId },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserFavorites = async (userId: number) => {
  try {
    const response = await axios.get(`${API_BASE}/favorites/${userId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
