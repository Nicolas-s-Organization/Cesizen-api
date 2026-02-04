import { Router } from "express";

import * as articleController from "../controllers/article.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
// import { createCategorySchema , updateCategorySchema} from "../schemas/category.schema";


const router = Router();

router.get("/", articleController.getArticles);
// router.post("/", authMiddleware, adminCheck, validate(createCategorySchema), catogoryController.createCategory);
// router.put("/:id", authMiddleware, adminCheck, validate(updateCategorySchema), catogoryController.updateCategory);
// router.delete("/:id", authMiddleware, adminCheck, catogoryController.deleteCategory);

export default router;