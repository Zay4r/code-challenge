import { Router } from "express";

import * as productController from "./product.controller";
import { AuthenticateToken } from "../../middleware/auth.middleware";
import { validateQuery } from "../../middleware/validation.middleware";


const router = Router();
const { validateBody } = require("../../middleware/validation.middleware");
const { product } = require("../../helper/validator");


router.post("/buy", AuthenticateToken, validateBody(product.buy), productController.buy); //upsert
router.put("/remove", AuthenticateToken, validateBody(product.buy), productController.remove);
router.get("/", AuthenticateToken, validateQuery(product.get), productController.get);
router.get("/bought", AuthenticateToken, productController.getBoughtProducts);
router.get("/:id", AuthenticateToken, productController.getDetail);

router.delete("/", AuthenticateToken, validateBody(product.delete), productController.deleteProducts);
export default router;
