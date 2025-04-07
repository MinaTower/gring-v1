import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
const prisma = new PrismaClient();
import * as jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const handleError = (
  res: Response,
  error: unknown,
  message = "Ошибка сервера",
) => {
  console.error(error);
  return res.status(500).json({ message });
};

export const registUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, favouriteCategory } = req.body;
    if (!email || !password || !name || !favouriteCategory) {
      return res.status(400).json({ message: "Заполните все поля" });
    }
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        name,
        favouriteCategory,
      },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return handleError(res, error);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Заполните все поля" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Пользователь с таким email не найден" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET as string,
      { expiresIn: "1h" },
    );
    return res.status(200).json({
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        favouriteCategory: user.favouriteCategory,
      },
      token,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const detailUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ message: "Email обязателен" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        favoriteRoutes: {
          include: {
            route: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  } catch (error) {
    return handleError(res, error);
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  } catch (error) {
    return handleError(res, error);
  }
};

export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const { userId, routeId } = req.body;
    if (!userId || !routeId) {
      return res
        .status(400)
        .json({ message: "Необходимо указать ID пользователя и маршрута" });
    }

    const existingFavorite = await prisma.favoriteRoute.findFirst({
      where: {
        userId: Number(userId),
        routeId: Number(routeId),
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "Маршрут уже в избранном" });
    }

    const newFavorite = await prisma.favoriteRoute.create({
      data: {
        userId: Number(userId),
        routeId: Number(routeId),
      },
    });

    return res.status(201).json(newFavorite);
  } catch (error) {
    return handleError(res, error);
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { userId, routeId } = req.body;
    if (!userId || !routeId) {
      return res
        .status(400)
        .json({ message: "Необходимо указать ID пользователя и маршрута" });
    }

    const favorite = await prisma.favoriteRoute.findFirst({
      where: {
        userId: Number(userId),
        routeId: Number(routeId),
      },
    });

    if (!favorite) {
      return res.status(404).json({ message: "Маршрут не найден в избранном" });
    }

    await prisma.favoriteRoute.delete({
      where: {
        id: favorite.id,
      },
    });

    return res.status(200).json({ message: "Маршрут удален из избранного" });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getUserFavoriteRoutes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Необходимо указать ID пользователя" });
    }

    const favorites = await prisma.favoriteRoute.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        route: true,
      },
    });

    return res.json(favorites);
  } catch (error) {
    return handleError(res, error);
  }
};
