import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getCategories } from "@/api/user-api";
import { createPlace } from "@/api/place-api";
import WrapperTemplate from "@/components/wrapper";
import { OptionCategory } from "@/interface";

const MapClickHandler = ({
  setCoordinate,
}: {
  setCoordinate: (coord: [number, number]) => void;
}) => {
  useMapEvents({
    click(e) {
      setCoordinate([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const PlaceCreate = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [coordinate, setCoordinate] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: (placeData: {
      name: string;
      description: string;
      category: string;
      coordinate: [number, number];
    }) => createPlace(placeData),
    onSuccess: () => {
      setName("");
      setDescription("");
      setCategory("");
      setCoordinate(null);
      setSuccess(true);
      setTimeout(() => navigate("/place/list"), 2000);
    },
    onError: (err) => {
      console.error("Error creating place:", err);
      setError("Не удалось создать место. Попробуйте позже.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !category || !coordinate) {
      setError("Пожалуйста, заполните все поля и выберите точку на карте.");
      return;
    }
    setError(null);
    mutation.mutate({ name, description, category, coordinate });
  };

  const defaultCenter: [number, number] = [55.7558, 37.6173];

  return (
    <WrapperTemplate>
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Добавление места
      </h1>
      <form onSubmit={handleSubmit} className="mb-8 max-w-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Название места
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Введите название места"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-gray-300 p-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Введите описание места"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Категория
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
          >
            <option value="">Выберите категорию</option>
            {categories.map((cat: OptionCategory) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-yellow-400 px-4 py-2 font-medium text-black hover:bg-yellow-500 disabled:bg-gray-300"
        >
          Добавить место
        </button>
      </form>

      {error && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800 shadow">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800 shadow">
          Место успешно добавлено!
        </div>
      )}

      <div className="mb-20 h-96 w-full rounded-lg border border-gray-300 shadow-md">
        <MapContainer
          center={defaultCenter}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapClickHandler setCoordinate={setCoordinate} />
          {coordinate && <Marker position={coordinate} />}
        </MapContainer>
      </div>
    </WrapperTemplate>
  );
};

export default PlaceCreate;
