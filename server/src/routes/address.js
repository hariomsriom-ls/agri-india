import { Router } from "express";createAddress
import { createAddress } from "../controllers/address.controller";

const router = Router()

router.route("/address").post(createAddress)

export default router
