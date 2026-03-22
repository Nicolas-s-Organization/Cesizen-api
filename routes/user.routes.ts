import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";


const router = Router();

router.get("/", authMiddleware, adminCheck, userController.getUsers);
router.get("/:userId", authMiddleware, adminCheck, userController.getUserById);
router.put("/:userId", authMiddleware, adminCheck, userController.updateUser);
router.delete("/:userId", authMiddleware, adminCheck, userController.deleteUser);


export default router;