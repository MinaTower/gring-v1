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

// Метод: POST
export const registUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, favouriteCategory } = req.body;
        if (!email || !password || !name || !favouriteCategory) {
            return res.status(400).json({ message: "Заполните все поля" });
        }
        const emailExists = await prisma.user.findUnique({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: "Пользователь с таким email уже существует" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                name,
                favouriteCategory
            },
        });
        return res.status(200).json(newUser)
    } catch (error) {
        return handleError(res, error)
    }
}

// Метод: POST
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Заполните все поля" });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Пользователь с таким email не найден" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ message: "Неверный пароль" });
        };
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET as string,
            { expiresIn: "1h" }
        )
        return res.status(200).json({
            user: { email: user.email },
            token
        })
    } catch (error) {
        return handleError(res, error)
    }
}