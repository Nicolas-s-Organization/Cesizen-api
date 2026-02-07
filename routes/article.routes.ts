import { Router } from "express";

import * as articleController from "../controllers/article.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { createArticleSchema , updateArticleSchema} from "../schemas/article.schema";
import { uploadArticleImage } from "../middlewares/upload.middleware";


const router = Router();

router.get("/", articleController.getArticles);
router.get("/:articleId", articleController.getArticleById);
router.post("/", authMiddleware, adminCheck, validate(createArticleSchema), articleController.createArticle);
router.patch("/:articleId/image", authMiddleware, adminCheck, uploadArticleImage.single("file"),articleController.uploadArticleImage);
router.patch("/:articleId", authMiddleware, adminCheck, validate(updateArticleSchema), articleController.updateArticle);
router.delete("/:articleId", authMiddleware, adminCheck, articleController.deleteArticle);

export default router;