import { Router } from "express";

import * as articleController from "../controllers/article.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { createArticleSchema } from "../schemas/article.schema";
import { uploadArticleImage } from "../middlewares/upload.middleware";


const router = Router();

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticleById);
router.post("/", authMiddleware, adminCheck, validate(createArticleSchema), articleController.createArticle);
router.post("/:articleId/image", authMiddleware, adminCheck, uploadArticleImage.single("file"),articleController.uploadArticleImage);
// router.put("/:id", authMiddleware, adminCheck, validate(updateCategorySchema), catogoryController.updateCategory);
// router.delete("/:id", authMiddleware, adminCheck, catogoryController.deleteCategory);

export default router;