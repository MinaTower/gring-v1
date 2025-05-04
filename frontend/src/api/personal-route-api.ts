import { getListPlaces } from "./place-api";
import { RouteDetails } from "@/interface";

export const generatePersonalRoute = async (
  favouriteCategory: string,
): Promise<RouteDetails> => {
  try {
    const allPlaces = await getListPlaces();

    const placesInCategory = allPlaces.filter(
      (place) => place.category === favouriteCategory,
    );

    const sortedPlaces = placesInCategory.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingB - ratingA;
    });

    const topPlaces = sortedPlaces.slice(0, 3);

    if (topPlaces.length < 3) {
      const otherHighRatedPlaces = allPlaces
        .filter((place) => place.category !== favouriteCategory)
        .sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        })
        .slice(0, 3 - topPlaces.length);

      topPlaces.push(...otherHighRatedPlaces);
    }

    const coordinates = topPlaces
      .filter((place) => place.coordinates)
      .map((place) => place.coordinates as [number, number]);

    const now = new Date();
    const personalRoute: RouteDetails = {
      id: now.getTime(),
      name: `${favouriteCategory}`,
      description: `"${favouriteCategory}"`,
      category: favouriteCategory,
      coordinates,
      places: topPlaces,
      createdAt: now.toISOString(),
    };

    return personalRoute;
  } catch (error) {
    console.error("Ошибка при генерации персонального маршрута:", error);
    throw error;
  }
};
