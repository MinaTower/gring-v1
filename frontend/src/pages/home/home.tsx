import { getListRoutes } from "@/api/route-api";
import WrapperTemplate from "@/components/wrapper";
import { RoutesList } from "@/interface";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: routes } = useQuery<RoutesList[]>({
    queryKey: ["Route"],
    queryFn: getListRoutes,
  });

  return (
    <section>
      <WrapperTemplate>
        {routes && routes.length > 0 ? (
          <ul className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:gap-2 max-sm:p-2">
            {routes.map((route, index) => (
              <li key={index}>
                <div className="h-full rounded-2xl border border-gray-200 p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-md active:-translate-y-1 max-lg:p-2">
                  <div className="flex items-center">
                    <h2 className="font-sans text-base font-bold max-sm:text-sm">
                      {route.name}
                    </h2>
                  </div>
                  <p className="text-gray-700">{route.description}</p>
                  <p className="text-gray-700">{route.category}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Маршруты не найдены.</p>
        )}
      </WrapperTemplate>
    </section>
  );
};

export default Home;
