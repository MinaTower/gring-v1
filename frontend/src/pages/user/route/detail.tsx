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
import { Place, RouteDetails } from "@/interface";

const RouteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [routePlaces, setRoutePlaces] = useState<Place[]>([]);

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
          <h1 className="mb-4 text-3xl font-bold">{route.name}</h1>
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
