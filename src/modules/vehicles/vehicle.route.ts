import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import { authRouter } from "../auth/auth.route";
import { auth } from "../../middleware/auth";

const router = Router();

// only admin
router.post("/", auth("admin"), vehicleController.createVehicle);
// only admin
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);
// only admin
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);
//public
router.get("/:vehicleId", vehicleController.getSingleVehicle);
//public
router.get("/", vehicleController.getAllVehicles);

export const vehicleRouter = router;
