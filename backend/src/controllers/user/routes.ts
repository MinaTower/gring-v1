import express = require("express");
import { Request, Response, NextFunction } from "express";
import {
  detailUser,
  getCategory,
  loginUser,
  registUser,
} from "./user.controller";

const router = express.Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/api/signup", asyncHandler(registUser));
router.post("/api/login", asyncHandler(loginUser));
router.get("/api/profile/:username", asyncHandler(detailUser));
router.get("/api/categories", asyncHandler(getCategory));

export default router;
