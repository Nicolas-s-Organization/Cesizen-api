import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";


const router = Router();

router.get("/", authMiddleware, adminCheck, userController.getUsers);
router.get("/:id", authMiddleware, adminCheck, userController.getUserById);
// router.put("/:id", userController.updateUser);
// router.delete("/:id", userController.deleteUser);


export default router;