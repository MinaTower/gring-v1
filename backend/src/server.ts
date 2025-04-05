import * as dotenv from "dotenv";
dotenv.config();

import express = require("express");
import cors = require("cors");
import userRouter from "./controllers/user/routes";
import routeRouter from "./controllers/path/routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(routeRouter);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Приложение запущено -> http://localhost:${port}`);
});
