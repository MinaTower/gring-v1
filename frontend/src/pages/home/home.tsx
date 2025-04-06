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
    <section>
      <WrapperTemplate>
        <h1 className="mb-6 text-2xl font-bold">Доступные маршруты</h1>
        {routes && routes.length > 0 ? (
          <ul className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:gap-2 max-sm:p-2">
            {routes.map((route) => (
              <li key={route.id}>
                <Link to={`/route/detail/${route.id}`}>
                  <div className="h-full rounded-2xl border border-gray-200 p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-md active:-translate-y-1 max-lg:p-2">
                    <div className="mb-2">
                      <h2 className="font-sans text-base font-bold max-sm:text-sm">
                        {route.name}
                      </h2>
                    </div>
                    <p className="mb-3 line-clamp-3 text-sm text-gray-700">
                      {route.description}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs">
                        {route.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center">
            <p className="mb-4 text-gray-600">Маршруты не найдены.</p>
            <Link
              to="/route/create"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
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
