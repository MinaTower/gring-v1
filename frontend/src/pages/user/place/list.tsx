import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import WrapperTemplate from "@/components/wrapper";
import { OptionCategory, Place } from "@/interface";
import { getCategories } from "@/api/user-api";
import { getListPlaces } from "@/api/place-api";

const PlaceList = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: places } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: getListPlaces,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const filteredPlaces = selectedCategory
    ? places?.filter((p) => p.category === selectedCategory)
    : places;

  return (
    <section className="py-8">
      <WrapperTemplate>
        <h1 className="mb-8 text-3xl font-extrabold text-gray-800">
          Список мест
        </h1>
        <div className="mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="">Все категории</option>
            {categories.map((cat: OptionCategory) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        {filteredPlaces && filteredPlaces.length > 0 ? (
          <ul className="grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {filteredPlaces.map((place) => (
              <li key={place.id} className="flex">
                <Link
                  to={`/place/detail/${place.id}`}
                  className="flex h-full w-full flex-col"
                >
                  <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg active:translate-y-0 max-lg:p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800 max-sm:text-base">
                        {place.name}
                      </h2>
                      {place.rating !== undefined && place.rating > 0 && (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20px"
                            viewBox="0 -960 960 960"
                            width="20px"
                            fill="#F9DB78"
                          >
                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                          </svg>
                          <span className="ml-1 text-sm text-gray-600">
                            {place.rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                      {place.description}
                    </p>
                    <div className="mt-auto">
                      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
                        {place.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="mb-4 text-gray-600">Места не найдены.</p>
            <Link
              to="/place/create"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Добавить место
            </Link>
          </div>
        )}
      </WrapperTemplate>
    </section>
  );
};

export default PlaceList;
