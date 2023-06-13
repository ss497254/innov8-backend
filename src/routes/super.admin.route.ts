import { superAdminController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { authProvider } from "../middlewares/auth";
import { getEnvConfig } from "../config";

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
    .route(
        "/super-admin/register/" + getEnvConfig("SUPER_ADMIN_REGISTER_SECRET")
    )
    .post(
        validate(
            userValidation.userRegister,
            superAdminController.superAdminRegister
        )
    );

router
    .route("/super-admin/project-form")
    .get(authProvider("super-admin"), superAdminController.getProjectForm)
    .put(authProvider("super-admin"), superAdminController.updateProjectForm);

router
    .route("/super-admin/logout")
    .get(authProvider("super-admin"), superAdminController.logout);

export default router;
