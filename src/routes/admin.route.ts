import { adminController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router.route("/admin/me").get(authProvider("admin"), adminController.getAdmin);

router
    .route("/admin/login")
    .post(validate(userValidation.userLogin, adminController.adminLogin));

router
    .route("/admin/register/")
    .post(validate(userValidation.userRegister, adminController.adminRegister));

export default router;
