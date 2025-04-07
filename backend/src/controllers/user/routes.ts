import express = require("express");
import { Request, Response, NextFunction } from "express";
import {
  detailUser,
  getCategory,
  loginUser,
  registUser,
  addToFavorites,
  removeFromFavorites,
  getUserFavoriteRoutes,
} from "./user.controller";

const router = express.Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/api/signup", asyncHandler(registUser));
router.post("/api/login", asyncHandler(loginUser));
router.get("/api/profile/:email", asyncHandler(detailUser));
router.get("/api/categories", asyncHandler(getCategory));
router.post("/api/favorites", asyncHandler(addToFavorites));
router.delete("/api/favorites", asyncHandler(removeFromFavorites));
router.get("/api/favorites/:userId", asyncHandler(getUserFavoriteRoutes));

export default router;
