import { Router } from "express";
import { registerLandOwner } from "../../controllers/user.controller/landowner.controller.js";

const router = Router()

router.route("/registerlandowner").post(registerLandOwner)

export default router