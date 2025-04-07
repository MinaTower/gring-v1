import { getListRoutes } from "@/api/route-api";
import WrapperTemplate from "@/components/wrapper";
import { RoutesList } from "@/interface";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: routes } = useQuery<RoutesList[]>({
    queryKey: ["Route"],
    queryFn: getListRoutes,
  });

  return (
    <section className="py-8">
      <WrapperTemplate>
        <h1 className="mb-8 text-3xl font-extrabold text-gray-800">
          Доступные маршруты
        </h1>
        {routes && routes.length > 0 ? (
          <ul className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {routes.map((route) => (
              <li key={route.id} className="flex">
                <Link
                  to={`/route/detail/${route.id}`}
                  className="flex h-full w-full flex-col"
                >
                  <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg active:translate-y-0 max-lg:p-4">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-gray-800 max-sm:text-base">
                        {route.name}
                      </h2>
                    </div>
                    <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                      {route.description}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                        {route.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="mb-4 text-gray-600">Маршруты не найдены.</p>
            <Link
              to="/route/create"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Создать маршрут
            </Link>
          </div>
        )}
      </WrapperTemplate>
    </section>
  );
};

export default Home;
