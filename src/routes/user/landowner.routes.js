import { Router } from "express";
import { registerLandOwner } from "../../controllers/user.controller/landowner.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";


const router = Router()

router.route("/registerlandowner").post(
    upload.fields([
       {
        name: "image",
        maxCount: 1
       },
       {
        name: "governmentId",
        maxCount: 1
       } 
    ]),
    registerLandOwner)

export default router