import { Router } from "express";

import * as catogoryController from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { createCategorySchema } from "../schemas/category.schema";


const router = Router();

router.get("/", catogoryController.getCategories);
router.post("/", authMiddleware, adminCheck, validate(createCategorySchema), catogoryController.createCategory);


export default router;