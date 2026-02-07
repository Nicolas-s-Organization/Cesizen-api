import { Router } from "express";

import * as trackerItemController from "../controllers/trackerItem.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminCheck } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate";
import { createTrackerItemSchema , updateTrackerItemSchema} from "../schemas/trackerItem.schema";


const router = Router();

router.get("/", authMiddleware, trackerItemController.getTrackerItems);
router.get("/:trackerItemId", authMiddleware, trackerItemController.getTrackerItemById);
router.post("/", authMiddleware, validate(createTrackerItemSchema), trackerItemController.createTrackerItem);
router.patch("/:trackerItemId", authMiddleware, validate(updateTrackerItemSchema), trackerItemController.updateTrackerItem);
router.delete("/:trackerItemId", authMiddleware, trackerItemController.deletetrackerItem);

export default router;