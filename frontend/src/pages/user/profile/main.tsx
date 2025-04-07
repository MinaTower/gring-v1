import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WrapperTemplate from "@/components/wrapper";
import { detailUser, getUserFavorites } from "@/api/user-api";
import { User, FavoriteRoute } from "@/interface";

const ProfileMain = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (!userString) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userString));
  }, [navigate]);

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: () => detailUser(user?.email || ""),
    enabled: !!user?.email,
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<
    FavoriteRoute[]
  >({
    queryKey: ["favorites", user?.id],
    queryFn: () => getUserFavorites(user?.id || 0),
    enabled: !!user?.id,
  });

  if (userLoading || favoritesLoading) {
    return (
      <WrapperTemplate>
        <div className="flex h-64 items-center justify-center">
          <p>Загрузка данных...</p>
        </div>
      </WrapperTemplate>
    );
  }

  if (userError || !userData) {
    return (
      <WrapperTemplate>
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">
            Ошибка при загрузке данных пользователя
          </p>
        </div>
      </WrapperTemplate>
    );
  }

  return (
    <WrapperTemplate>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Профиль пользователя</h1>
            <button
              className="rounded-md bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Выйти
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-lg font-semibold">Личная информация</h2>
              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <p>
                  <span className="font-medium">Имя:</span> {userData.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {userData.email}
                </p>
                <p>
                  <span className="font-medium">Любимая категория:</span>{" "}
                  {userData.favouriteCategory}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Избранные маршруты</h2>
          </div>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <Link
                  key={favorite.id}
                  to={`/route/detail/${favorite.route.id}`}
                  className="group block"
                >
                  <div className="h-full rounded-lg border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <h3 className="mb-2 text-lg font-medium group-hover:text-blue-600">
                      {favorite.route.name}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {favorite.route.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                        {favorite.route.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(favorite.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-8 text-center">
              <p className="mb-4 text-gray-500">
                У вас пока нет избранных маршрутов
              </p>
              <Link
                to="/route"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Найти маршруты
              </Link>
            </div>
          )}
        </div>
      </div>
    </WrapperTemplate>
  );
};

export default ProfileMain;
