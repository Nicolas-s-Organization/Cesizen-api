import { Router } from "express";

import * as authController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "../schemas/auth.schema";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken); 
router.get("/me", authMiddleware, authController.getMe);
router.put("/me", authMiddleware, validate(updateProfileSchema), authController.updateMe);
router.post("/logout", authController.logout);
router.put("/me/password", authMiddleware, validate(changePasswordSchema), authController.changePassword);


export default router;
