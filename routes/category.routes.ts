import { Router } from "express";

import * as catogoryController from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { createCategorySchema , updateCategorySchema} from "../schemas/category.schema";


const router = Router();

router.get("/", catogoryController.getCategories);
router.post("/", authMiddleware, adminCheck, validate(createCategorySchema), catogoryController.createCategory);
router.put("/:id", authMiddleware, adminCheck, validate(updateCategorySchema), catogoryController.updateCategory);


export default router;