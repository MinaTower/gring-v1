import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPlace = async (req: Request, res: Response) => {
  try {
    const { name, description, category, coordinate } = req.body;

    let categoryObj = await prisma.category.findFirst({
      where: { name: category },
    });

    if (!categoryObj) {
      categoryObj = await prisma.category.create({
        data: { name: category },
      });
    }

    const newPlace = await prisma.place.create({
      data: {
        name,
        description,
        rating: 0,
        coordinates: coordinate,
        categories: {
          connect: { id: categoryObj.id },
        },
      },
      include: { categories: true },
    });

    return res.status(201).json(newPlace);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка создания места" });
  }
};

export const getPlaces = async (req: Request, res: Response) => {
  try {
    const places = await prisma.place.findMany({
      include: { categories: true },
    });

    const formattedPlaces = places.map((place) => ({
      ...place,
      category: place.categories.length > 0 ? place.categories[0].name : null,
    }));

    return res.json(formattedPlaces);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка получения мест" });
  }
};

export const getPlaceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const place = await prisma.place.findUnique({
      where: { id: Number(id) },
      include: { categories: true },
    });

    if (!place) {
      return res.status(404).json({ message: "Место не найдено" });
    }

    const formattedPlace = {
      ...place,
      category: place.categories.length > 0 ? place.categories[0].name : null,
    };

    return res.json(formattedPlace);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка получения данных о месте" });
  }
};
