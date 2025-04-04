import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { appRoutes, privateRoutes } from "./routes";
import "./style.css";

const allRoutes = [...appRoutes, ...privateRoutes];

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
          {allRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
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
