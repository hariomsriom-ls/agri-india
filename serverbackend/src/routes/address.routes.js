import { Router } from "express";createAddress
import { createAddress } from "../controllers/address.controller.js";
import {getCountry,getState,getDistrict} from "../services/getdropdownlist.js";
const router = Router()

router.route("/address").post(createAddress)
router.route("/get-country").get(getCountry)
router.route("/get-state").get(getState)
router.route("/get-district").get(getDistrict)

export default router
