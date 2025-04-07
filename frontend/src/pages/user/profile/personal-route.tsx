import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WrapperTemplate from "@/components/wrapper";
import { generatePersonalRoute } from "@/api/personal-route-api";
import { RouteDetails } from "@/interface";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PersonalRoute = () => {
  const [user, setUser] = useState<{ favouriteCategory: string } | null>(null);
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userString = localStorage.getItem("user");
      if (!userString) {
        navigate("/login");
        return;
      }

      try {
        const userData = JSON.parse(userString);
        setUser(userData);

        // Если у пользователя есть любимая категория, генерируем маршрут
        if (userData.favouriteCategory) {
          setIsLoading(true);
          const personalRoute = await generatePersonalRoute(
            userData.favouriteCategory,
          );
          setRoute(personalRoute);
        } else {
          setError("У вас не указана любимая категория в профиле");
        }
      } catch (err) {
        console.error("Ошибка при получении данных:", err);
        setError("Не удалось сгенерировать персональный маршрут");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleRegenerateRoute = async () => {
    if (!user?.favouriteCategory) return;

    try {
      setIsLoading(true);
      setError(null);
      const personalRoute = await generatePersonalRoute(user.favouriteCategory);
      setRoute(personalRoute);
    } catch (err) {
      console.error("Ошибка при регенерации маршрута:", err);
      setError("Не удалось обновить персональный маршрут");
    } finally {
      setIsLoading(false);
    }
  };

  const getMapCenter = (): [number, number] => {
    if (route?.coordinates && route.coordinates.length > 0) {
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
    return [55.7558, 37.6173]; // Москва по умолчанию
  };

  return (
    <WrapperTemplate>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Персональный маршрут</h1>
          <button
            onClick={handleRegenerateRoute}
            disabled={isLoading}
            className="rounded bg-yellow-400 px-4 py-2 font-medium text-black hover:bg-yellow-500 disabled:bg-gray-300"
          >
            {isLoading ? "Загрузка..." : "Обновить маршрут"}
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p>Генерация персонального маршрута...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            <p>{error}</p>
          </div>
        ) : route ? (
          <>
            <div className="mb-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">{route.name}</h2>
                <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm">
                  {route.category}
                </span>
              </div>
              <p className="text-gray-700">{route.description}</p>
            </div>

            {route.coordinates && route.coordinates.length > 0 ? (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Маршрут на карте</h2>
                <div className="h-[500px] rounded-lg border">
                  <MapContainer
                    center={getMapCenter()}
                    zoom={12}
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

                    {route.places?.map(
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
                                {place.rating !== undefined && (
                                  <div className="mt-1 flex items-center">
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
                                    <span className="text-xs">
                                      {place.rating}/5
                                    </span>
                                  </div>
                                )}
                                {place.category && (
                                  <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs">
                                    {place.category}
                                  </span>
                                )}
                              </div>
                            </Popup>
                          </Marker>
                        ),
                    )}
                  </MapContainer>
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-lg bg-yellow-50 p-4 text-yellow-700">
                <p>
                  Недостаточно мест с координатами для построения маршрута.
                  Попробуйте добавить места с координатами в любимой категории.
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Места в маршруте</h2>

              {route.places && route.places.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {route.places.map((place) => (
                    <div
                      key={place.id}
                      className="h-full rounded-lg border border-gray-200 p-4 transition-all duration-300"
                    >
                      <h3 className="mb-2 font-medium">{place.name}</h3>
                      <p className="mb-2 line-clamp-3 text-sm text-gray-600">
                        {place.description}
                      </p>
                      <div className="flex items-center justify-between">
                        {place.rating !== undefined && (
                          <div className="flex items-center">
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
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  В вашем персональном маршруте нет мест
                </p>
              )}
            </div>

            <div className="mb-8 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-medium">
                О персональном маршруте
              </h2>
              <p className="text-sm text-gray-600">
                Этот маршрут создан специально для вас на основе вашей любимой
                категории "{route.category}". Маршрут не сохраняется и
                генерируется каждый раз заново. Вы можете использовать кнопку
                "Обновить маршрут", чтобы создать новый вариант.
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p>Невозможно создать персональный маршрут</p>
          </div>
        )}
      </div>
    </WrapperTemplate>
  );
};

export default PersonalRoute;
