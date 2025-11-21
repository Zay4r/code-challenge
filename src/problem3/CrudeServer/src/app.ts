import express, { Request, Response, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./module/auth/auth.route";
import ProductRoute from "./module/product/product.route";
const app = express();
const apiRouter = Router();
app.use(helmet());
app.use(
  cors({
    origin: "*",
    allowedHeaders: [
      "Accept-Version",
      "Authorization",
      "Credentials",
      "Content-Type",
      "Accept-Language",
    ],
  })
);
require("dotenv").config();
app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ limit: "300mb", extended: true }));
app.use(cookieParser());

apiRouter.get("/", (req: Request, res: Response) => {
  res.send({ message: "Japan Job APIs up and running" });
});


apiRouter.use("/auth", AuthRoute);
apiRouter.use("/products", ProductRoute);
app.use("/v1", apiRouter);

export default app;