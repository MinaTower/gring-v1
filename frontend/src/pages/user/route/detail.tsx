import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WrapperTemplate from "@/components/wrapper";
import { getRouteById } from "@/api/route-api";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { getListPlaces } from "@/api/place-api";
import {
  addRouteToFavorites,
  removeRouteFromFavorites,
  getUserFavorites,
} from "@/api/user-api";
import { FavoriteRoute, Place, RouteDetails, User } from "@/interface";

const RouteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [routePlaces, setRoutePlaces] = useState<Place[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const {
    data: route,
    isLoading: routeLoading,
    error: routeError,
  } = useQuery<RouteDetails>({
    queryKey: ["route", id],
    queryFn: () => getRouteById(id || ""),
    enabled: !!id,
  });

  const { data: allPlaces = [] } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: getListPlaces,
  });

  useEffect(() => {
    if (route?.coordinates && allPlaces.length > 0) {
      const placesOnRoute = allPlaces.filter((place) => {
        if (!place.coordinates) return false;
        return route.coordinates.some(
          (routeCoord) =>
            Math.abs(routeCoord[0] - place.coordinates![0]) < 0.0001 &&
            Math.abs(routeCoord[1] - place.coordinates![1]) < 0.0001,
        );
      });

      setRoutePlaces(placesOnRoute);
    }
  }, [route, allPlaces]);

  useEffect(() => {
    const checkIfInFavorites = async () => {
      if (user && id) {
        try {
          const favorites = await getUserFavorites(user.id);
          const isFavorite = favorites.some(
            (fav: FavoriteRoute) => fav.routeId === Number(id),
          );
          setIsInFavorites(isFavorite);
        } catch (error) {
          console.error("Ошибка при получении списка избранного:", error);
        }
      }
    };

    checkIfInFavorites();
  }, [user, id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert("Для добавления в избранное необходимо авторизоваться");
      return;
    }
    if (!id) return;
    setIsLoading(true);
    try {
      if (isInFavorites) {
        await removeRouteFromFavorites(user.id, Number(id));
        setIsInFavorites(false);
      } else {
        await addRouteToFavorites(user.id, Number(id));
        setIsInFavorites(true);
      }
    } catch (error) {
      console.error("Ошибка при обновлении избранного:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL скопирован");
  };

  if (routeLoading) {
    return (
      <WrapperTemplate>
        <div className="flex h-64 items-center justify-center">
          <p>Загрузка данных...</p>
        </div>
      </WrapperTemplate>
    );
  }

  if (routeError || !route) {
    return (
      <WrapperTemplate>
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">Ошибка при загрузке данных о маршруте</p>
        </div>
      </WrapperTemplate>
    );
  }

  const getMapCenter = (): [number, number] => {
    if (route.coordinates && route.coordinates.length > 0) {
      const sumLat = route.coordinates.reduce(
        (sum, coord) => sum + coord[0],
        0,
      );
      const sumLng = route.coordinates.reduce(
        (sum, coord) => sum + coord[1],
        0,
      );
      return [
        sumLat / route.coordinates.length,
        sumLng / route.coordinates.length,
      ];
    }
    return [55.7558, 37.6173];
  };

  const getZoomLevel = (): number => {
    if (route.coordinates && route.coordinates.length > 0) {
      return route.coordinates.length > 10 ? 10 : 13;
    }
    return 12;
  };

  return (
    <WrapperTemplate>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="mb-4 text-3xl font-bold">{route.name}</h1>
            <div className="flex gap-2">
              {user && (
                <button
                  onClick={handleFavoriteToggle}
                  disabled={isLoading}
                  className={`flex items-center rounded-full px-4 py-2 ${
                    isInFavorites
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isInFavorites ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="mr-2 h-5 w-5"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                  {isLoading
                    ? "Загрузка..."
                    : isInFavorites
                      ? "Удалить из избранного"
                      : "Добавить в избранное"}
                </button>
              )}
              <button
                onClick={handleCopyUrl}
                className="flex items-center rounded-full bg-gray-100 px-4 py-2 text-gray-600 hover:bg-gray-200"
              >
                Скопировать URL
              </button>
            </div>
          </div>
          <div className="mb-6 flex items-center">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm">
              {route.category}
            </span>
          </div>
          <p className="mb-6 text-gray-700">{route.description}</p>
        </div>

        {route.coordinates && route.coordinates.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Маршрут на карте</h2>
            <div className="h-[500px] rounded-lg border">
              <MapContainer
                center={getMapCenter()}
                zoom={getZoomLevel()}
                style={{ height: "100%", width: "100%" }}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Polyline
                  positions={route.coordinates}
                  color="#3B82F6"
                  weight={4}
                  opacity={0.7}
                />

                {route.coordinates.length > 0 && (
                  <>
                    <Marker position={route.coordinates[0]}>
                      <Popup>Начало маршрута</Popup>
                    </Marker>
                    <Marker
                      position={route.coordinates[route.coordinates.length - 1]}
                    >
                      <Popup>Конец маршрута</Popup>
                    </Marker>
                  </>
                )}

                {routePlaces.map(
                  (place) =>
                    place.coordinates && (
                      <Marker
                        key={place.id}
                        position={place.coordinates as [number, number]}
                      >
                        <Popup>
                          <div>
                            <h3 className="font-semibold">{place.name}</h3>
                            <p className="text-sm">{place.description}</p>
                            {place.category && (
                              <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs">
                                {place.category}
                              </span>
                            )}
                            <div className="mt-2">
                              <Link
                                to={`/place/detail/${place.id}`}
                                className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                              >
                                Подробнее
                              </Link>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ),
                )}
              </MapContainer>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Места на маршруте</h2>
          {routePlaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {routePlaces.map((place) => (
                <Link
                  to={`/place/detail/${place.id}`}
                  key={place.id}
                  className="group"
                >
                  <div className="h-full rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <h3 className="mb-2 font-medium group-hover:text-blue-600">
                      {place.name}
                    </h3>
                    {place.rating !== undefined && place.rating > 0 && (
                      <div className="mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16px"
                          viewBox="0 -960 960 960"
                          width="16px"
                          fill="#F9DB78"
                          className="mr-1"
                        >
                          <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                        </svg>
                        <span className="text-xs">{place.rating}/5</span>
                      </div>
                    )}
                    {place.category && (
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs">
                        {place.category}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Нет добавленных мест на этом маршруте
            </p>
          )}
        </div>

        <div className="mb-8 rounded-lg bg-gray-50 p-4">
          <h2 className="mb-2 text-xl font-semibold">Информация о маршруте</h2>
          <div className="text-sm text-gray-600">
            <p>Количество точек: {route.coordinates.length}</p>
            <p>Количество мест: {routePlaces.length}</p>
            {route.createdAt && (
              <p>Создан: {new Date(route.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>
    </WrapperTemplate>
  );
};

export default RouteDetail;
