// import React from 'react'

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
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
  };

  const hideHeaderPaths = ["/login", "/signup"];

  if (hideHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <header>
      <nav className="mx-auto w-full max-w-screen-xl shadow-lg">
        <div className="flex min-h-16 items-center justify-between">
          <Link
            to="/"
            className="hover:bg-base-300 rounded-lg px-2 py-1 text-lg transition-colors"
          >
            <span className="font-bold">GRing</span>
          </Link>
          <ul className="flex items-center justify-around space-x-4 px-1 py-3">
            {user ? (
              <>
                <li>
                  <Link
                    to="/plant/create"
                    className="hover:bg-base-300 rounded-md p-1 text-lg transition-colors"
                  >
                    Добавить
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${user.username}`}
                    className="hover:bg-base-300 rounded-md p-1 text-lg underline transition-colors"
                  >
                    {user.username}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="hover:bg-base-300 rounded-md p-1 text-lg underline transition-colors"
                  >
                    Выйти
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/signup"
                    className="hover:bg-base-300 rounded-md px-2 py-1 text-lg underline transition-colors"
                  >
                    Регистрация
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:bg-base-300 rounded-md px-2 py-1 text-lg underline transition-colors"
                  >
                    Вход
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
