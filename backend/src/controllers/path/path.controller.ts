import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handleError = (
  res: Response,
  error: unknown,
  message = "Ошибка сервера",
) => {
  console.error(error);
  return res.status(500).json({ message });
};

export const createRoute = async (req: Request, res: Response) => {
  try {
    const { name, description, category, coordinates } = req.body;

    if (!name || !description || !coordinates) {
      return res
        .status(400)
        .json({ message: "Обязательные поля не заполнены" });
    }

    const newRoute = await prisma.route.create({
      data: {
        name,
        description,
        category: category || "Общая",
        coordinates,
      },
    });

    return res.status(201).json(newRoute);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany();
    return res.json(routes);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getRouteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const route = await prisma.route.findUnique({
      where: { id: Number(id) },
    });

    if (!route) {
      return res.status(404).json({ message: "Маршрут не найден" });
    }

    return res.json(route);
  } catch (error) {
    return handleError(res, error);
  }
};
