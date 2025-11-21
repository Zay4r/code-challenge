import { Router } from "express";

import * as authController from "./auth.controller";


const router = Router();
const { validateBody } = require("../../middleware/validation.middleware");
const { auth } = require("../../helper/validator");


router.post("/login", validateBody(auth.login), authController.login);

export default router;
