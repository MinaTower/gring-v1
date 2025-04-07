import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { appRoutes, privateRoutes } from "./routes";
import PrivateRoute from "./private-route";
import "./style.css";

const AppRouter = () => {
  return (
    <main>
      <Suspense
        fallback={
          <div className="loader__wrapper">
            <span className="loader"></span>
          </div>
        }
      >
        <Routes>
          {appRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.component />
                </PrivateRoute>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/api" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default AppRouter;
