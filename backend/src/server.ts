import * as dotenv from "dotenv";
dotenv.config();

import express = require("express");
import cors = require("cors");
import userRouter from "./controllers/user/routes";
import routeRouter from "./controllers/route/routes";
import placeRouter from "./controllers/place/routes";
import reviewRoutes from "./controllers/review/routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(routeRouter);
app.use(placeRouter);
app.use(reviewRoutes);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Приложение запущено -> http://localhost:${port}`);
});
