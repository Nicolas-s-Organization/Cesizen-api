import { Router } from "express";
import * as catogoryController from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";


const router = Router();

router.get("/", catogoryController.getCategories);


export default router;