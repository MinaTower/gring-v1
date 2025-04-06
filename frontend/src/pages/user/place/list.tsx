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
    <WrapperTemplate>
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded border border-gray-300 p-2"
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
        <ul className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:gap-2 max-sm:p-2">
          {filteredPlaces.map((place) => (
            <li key={place.id}>
              <Link to={`/place/detail/${place.id}`}>
                <div className="h-full rounded-2xl border border-gray-200 p-6 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-md">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-sans text-base font-bold max-sm:text-sm">
                      {place.name}
                    </h2>
                    {place.rating !== undefined && place.rating > 0 && (
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#F9DB78"
                        >
                          <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                        </svg>
                        <span className="text-sm">{place.rating}/5</span>
                      </div>
                    )}
                  </div>
                  <p className="mb-2 line-clamp-2 text-sm text-gray-700">
                    {place.description}
                  </p>
                  <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs">
                    {place.category}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Места не найдены.</p>
      )}
    </WrapperTemplate>
  );
};

export default PlaceList;
