import { Router } from "express";

import * as emotionController from "../controllers/emotion.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { createEmotionSchema , updateEmotionSchema} from "../schemas/emotion.schema";


const router = Router();

router.get("/", authMiddleware, emotionController.getEmotions);
router.get("/:emotionId", authMiddleware, emotionController.getEmotionById); // attention que pour les emotions de niveau 1
router.post("/", authMiddleware, adminCheck, validate(createEmotionSchema), emotionController.createEmotion);
router.patch("/:emotionId", authMiddleware, adminCheck, validate(updateEmotionSchema), emotionController.updateEmotion);
router.delete("/:emotionId", authMiddleware, adminCheck, emotionController.deleteEmotion);

export default router;