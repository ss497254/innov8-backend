import { superAdminController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router
    .route("/super-admin/me")
    .get(authProvider("super-admin"), superAdminController.getSuperAdmin);

router
    .route("/super-admin/login")
    .post(
        validate(userValidation.userLogin, superAdminController.superAdminLogin)
    );

router
    .route("/super-admin/register/")
    .post(
        validate(
            userValidation.userRegister,
            superAdminController.superAdminRegister
        )
    );

router
    .route("/super-admin/logout")
    .get(authProvider("super-admin"), superAdminController.logout);

export default router;
