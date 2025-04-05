import { useState } from "react";
import { MapContainer, TileLayer, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WrapperTemplate from "@/components/wrapper";
import { createRoute } from "@/api/route-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateRouteData, OptionCategory } from "@/interface";
import { getCategories } from "@/api/user-api";

const MapEvents = ({
  positions,
  setPositions,
}: {
  positions: [number, number][];
  setPositions: (positions: [number, number][]) => void;
}) => {
  useMapEvents({
    click: (e) => {
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPositions([...positions, newPoint]);
    },
  });
  return null;
};

const CreateRoute = () => {
  const [positions, setPositions] = useState<[number, number][]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (newRoute: CreateRouteData) => createRoute(newRoute),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleSave = () => {
    if (!name || !description || positions.length < 2) {
      setError(
        "Пожалуйста, заполните все поля и отметьте минимум 2 точки на карте",
      );
      return;
    }
    setIsSaving(true);
    setError(null);

    mutation.mutate(
      {
        name,
        description,
        category,
        coordinates: positions,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setCategory("");
          setPositions([]);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          setIsSaving(false);
        },
        onError: (err) => {
          console.error("Ошибка при сохранении маршрута:", err);
          setError(
            "Не удалось сохранить маршрут. Пожалуйста, попробуйте позже.",
          );
          setIsSaving(false);
        },
      },
    );
  };

  const clearRoute = () => {
    setPositions([]);
  };

  const defaultCenter: [number, number] = [55.7558, 37.6173];

  return (
    <WrapperTemplate>
      <div className="mb-10">
        <h1 className="mb-6 text-2xl font-bold">Создание маршрута</h1>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Название маршрута
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Введите название маршрута"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">Выберите категорию</option>
              {categories &&
                categories.map((cat: OptionCategory) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            Описание маршрута
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            rows={3}
            placeholder="Опишите маршрут, интересные места и особенности"
            required
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Отметьте точки маршрута на карте, кликая в нужных местах
          </p>
        </div>

        <div className="h-[400px] overflow-hidden rounded-lg border border-gray-300">
          <MapContainer
            center={defaultCenter}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {positions.length > 0 && (
              <Polyline positions={positions} color="blue" />
            )}
            <MapEvents positions={positions} setPositions={setPositions} />
          </MapContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded bg-yellow-400 px-4 py-2 font-medium text-black hover:bg-yellow-500 disabled:bg-gray-300"
          >
            {isSaving ? "Сохранение..." : "Сохранить маршрут"}
          </button>

          <button
            onClick={clearRoute}
            className="rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Очистить маршрут
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="mt-4 rounded-md bg-green-50 p-3 text-green-700">
            Маршрут успешно сохранен!
          </div>
        )}

        {positions.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium">
              Точки маршрута ({positions.length}):
            </h3>
            <div className="max-h-40 overflow-y-auto rounded border border-gray-200 p-2">
              {positions.map((pos, index) => (
                <div key={index} className="mb-1 text-xs text-gray-600">
                  Точка {index + 1}: {pos[0].toFixed(6)}, {pos[1].toFixed(6)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </WrapperTemplate>
  );
};

export default CreateRoute;
