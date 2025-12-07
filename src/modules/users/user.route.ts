import { Router } from "express";
import { usersController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { updateUserGuard } from "../../middleware/updateGuird";

const router = Router();

// admin only
router.get("/", auth("admin"), usersController.getUsers);
// admin user own profile update
router.put(
  "/:userId",
  auth("admin", "customer"),
  updateUserGuard,
  usersController.updateUser
);
router.delete("/:userId", auth("admin"), usersController.deleteUser);

export const usersRouter = router;
