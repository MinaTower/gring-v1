import axios from "axios";
import { Review } from "@/interface";

const API_BASE = import.meta.env.VITE_API_BASE;

export const createReview = async (reviewData: {
  userId: number;
  placeId: number;
  rating: number;
  comment: string;
}): Promise<Review> => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_BASE}/reviews`, reviewData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getReviewsByPlaceId = async (
  placeId: string,
): Promise<Review[]> => {
  const response = await axios.get(`${API_BASE}/places/${placeId}/reviews`);
  return response.data;
};
