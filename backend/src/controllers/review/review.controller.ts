import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createReview = async (req: Request, res: Response) => {
  try {
    const { userId, placeId, rating, comment } = req.body;

    // Проверка наличия обязательных полей
    if (!userId || !placeId || rating === undefined) {
      return res
        .status(400)
        .json({ message: "Не все обязательные поля заполнены" });
    }

    // Проверка диапазона рейтинга
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Рейтинг должен быть от 1 до 5" });
    }

    // Создание отзыва
    const newReview = await prisma.reviews.create({
      data: {
        userId: Number(userId),
        placeId: Number(placeId),
        rating,
        comment: comment || "",
      },
    });

    // Обновление среднего рейтинга места
    const reviews = await prisma.reviews.findMany({
      where: { placeId: Number(placeId) },
    });

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await prisma.place.update({
      where: { id: Number(placeId) },
      data: { rating: Math.round(averageRating) },
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при создании отзыва" });
  }
};

export const getReviewsByPlaceId = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({ message: "ID места обязателен" });
    }

    const reviews = await prisma.reviews.findMany({
      where: { placeId: Number(placeId) },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при получении отзывов" });
  }
};
