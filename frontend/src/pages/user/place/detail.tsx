import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import WrapperTemplate from "@/components/wrapper";
import { getPlaceById } from "@/api/place-api";
import { getReviewsByPlaceId, createReview } from "@/api/review-api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Place, Review } from "@/interface";
import { useState } from "react";

const PlaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const userDataString = localStorage.getItem("user");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const userId = userData?.id;

  const {
    data: place,
    isLoading: placeLoading,
    error: placeError,
  } = useQuery<Place>({
    queryKey: ["place", id],
    queryFn: () => getPlaceById(id || ""),
    enabled: !!id,
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery<Review[]>({
    queryKey: ["reviews", id],
    queryFn: () => getReviewsByPlaceId(id || ""),
    enabled: !!id,
  });

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);

      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["place", id] });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !id) return;

    createReviewMutation.mutate({
      userId: Number(userId),
      placeId: Number(id),
      rating: reviewRating,
      comment: reviewComment,
    });
  };

  if (placeLoading) {
    return (
      <WrapperTemplate>
        <div className="flex h-64 items-center justify-center">
          <p>Загрузка данных...</p>
        </div>
      </WrapperTemplate>
    );
  }

  if (placeError || !place) {
    return (
      <WrapperTemplate>
        <div className="flex h-64 items-center justify-center">
          <p className="text-red-500">Ошибка при загрузке данных о месте</p>
        </div>
      </WrapperTemplate>
    );
  }
  return (
    <WrapperTemplate>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold">{place.name}</h1>
          <div className="mb-6 flex items-center">
            <span className="mr-4 rounded-full bg-blue-100 px-3 py-1 text-sm">
              {place.category}
            </span>
            {place.rating !== undefined && (
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#F9DB78"
                  className="mr-1"
                >
                  <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                </svg>
                <span>{place.rating}/5</span>
              </div>
            )}
          </div>
          <p className="mb-6 text-gray-700">{place.description}</p>
        </div>
        {place.coordinates && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Расположение</h2>
            <div className="h-96 rounded-lg border">
              <MapContainer
                center={place.coordinates as [number, number]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={place.coordinates as [number, number]}>
                  <Popup>{place.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Отзывы</h2>
            {userId && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="rounded bg-yellow-400 px-4 py-2 font-medium text-black hover:bg-yellow-500 disabled:bg-gray-300"
              >
                Оставить отзыв
              </button>
            )}
          </div>
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-6 rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-4">
                <label className="mb-2 block">Ваша оценка:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill={reviewRating >= star ? "#F9DB78" : "gray"}
                      >
                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2 block">Ваш комментарий:</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2"
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  disabled={createReviewMutation.isPending}
                >
                  {createReviewMutation.isPending
                    ? "Отправка..."
                    : "Отправить отзыв"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
          {reviewsLoading ? (
            <p className="py-4 text-center">Загрузка отзывов...</p>
          ) : reviewsError ? (
            <p className="py-4 text-center text-red-500">
              Ошибка при загрузке отзывов
            </p>
          ) : reviews && reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium">
                        {review.user?.name || "Пользователь"}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill={i < review.rating ? "#F9DB78" : "gray"}
                        >
                          <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-center text-gray-500">Пока нет отзывов</p>
          )}
        </div>
      </div>
    </WrapperTemplate>
  );
};

export default PlaceDetail;
