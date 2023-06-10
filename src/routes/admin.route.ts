import { adminController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router.route("/admin/me").get(authProvider("admin"), adminController.getAdmin);

router
    .route("/admin/judge-details")
    .get(
        authProvider("admin"),
        validate(userValidation.findUser, adminController.getJudgeMemberByEmail)
    );

router
    .route("/admin/coach-details")
    .get(
        authProvider("admin"),
        validate(userValidation.findUser, adminController.getCoachMemberByEmail)
    );

router
    .route("/admin/login")
    .post(validate(userValidation.userLogin, adminController.adminLogin));

router
    .route("/admin/register/")
    .post(validate(userValidation.userRegister, adminController.adminRegister));

router
    .route("/admin/logout")
    .get(authProvider("admin"), adminController.logout);

export default router;
