import { Place } from "@/interface";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

export const createPlace = async (placeData: {
  name: string;
  description: string;
  category: string;
  coordinate: [number, number];
}) => {
  try {
    const response = await axios.post(`${API_BASE}/places`, placeData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getListPlaces = async (): Promise<Place[]> => {
  const response = await axios.get(`${API_BASE}/places`);
  return response.data;
};

export const getPlacesByCategory = async (
  category: string,
): Promise<Place[]> => {
  const allPlaces = await getListPlaces();
  return allPlaces.filter((place) => place.category === category);
};

export const getPlaceById = async (id: string): Promise<Place> => {
  const response = await axios.get(`${API_BASE}/places/${id}`);
  return response.data;
};
