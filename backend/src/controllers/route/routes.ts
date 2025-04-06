import express = require("express");
import { Request, Response, NextFunction } from "express";
import { createRoute, getRoutes, getRouteById } from "./route.controller";

const router = express.Router();

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/api/routes", asyncHandler(createRoute));
router.get("/api/routes", asyncHandler(getRoutes));
router.get("/api/routes/:id", asyncHandler(getRouteById));

export default router;
