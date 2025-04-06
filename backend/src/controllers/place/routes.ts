import express = require("express");
import { Request, Response, NextFunction } from "express";
import { createPlace, getPlaceById, getPlaces } from "./place.controller";

const router = express.Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/api/places", asyncHandler(createPlace));
router.get("/api/places", asyncHandler(getPlaces));
router.get("/api/places/:id", asyncHandler(getPlaceById));

export default router;
