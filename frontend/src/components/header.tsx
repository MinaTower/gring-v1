import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState<{ uuid: string; name: string } | null>(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const hideHeaderPaths = ["/login", "/signup"];

  if (hideHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex w-full max-w-screen-xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 hover:text-gray-600"
        >
          GRing
        </Link>
        <ul className="flex items-center space-x-6">
          <li>
            <Link
              to="/"
              className="text-gray-700 transition-colors hover:text-gray-900"
            >
              Список маршрутов
            </Link>
          </li>
          <li>
            <Link
              to="/place/list"
              className="text-gray-700 transition-colors hover:text-gray-900"
            >
              Список мест
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/place/create"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Добавить место
                </Link>
              </li>
              <li>
                <Link
                  to="/route/create"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Создать маршрут
                </Link>
              </li>
              <li>
                <Link
                  to="/route/personal"
                  className="text-gray-700 transition-colors hover:text-gray-900"
                >
                  Персональный маршрут
                </Link>
              </li>
              <li>
                <Link
                  to={`/profile/${user.uuid}`}
                  className="font-medium text-gray-700 transition-colors hover:text-gray-900"
                >
                  {user.name}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-600 transition-colors hover:text-red-800"
                >
                  Выйти
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  Регистрация
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  Вход
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
