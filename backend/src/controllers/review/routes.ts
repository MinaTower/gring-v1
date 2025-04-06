import express = require("express");
import { Request, Response, NextFunction } from "express";
import { createReview, getReviewsByPlaceId } from "./review.controller";

const router = express.Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/api/reviews", asyncHandler(createReview));
router.get("/api/places/:placeId/reviews", asyncHandler(getReviewsByPlaceId));

export default router;
