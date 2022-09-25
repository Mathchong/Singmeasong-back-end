import cors from "cors";
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";
import testingRouter from "./routers/testingRouter.js";

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "TEST") {
    app.use("/test", testingRouter);
}
app.use("/recommendations", recommendationRouter);
app.use(errorHandlerMiddleware);

export default app;
