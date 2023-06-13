import express from "express";
import { userManagementController } from "../controllers";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router
    .route("/super-admin/admins")
    .get(authProvider("super-admin"), userManagementController.getAllAdmins);

router
    .route("/super-admin/coaches")
    .get(authProvider("super-admin"), userManagementController.getAllCoaches);

router
    .route("/super-admin/employees")
    .get(authProvider("super-admin"), userManagementController.getAllEmployees);

router
    .route("/super-admin/judges")
    .get(authProvider("super-admin"), userManagementController.getAllJudges);

export default router;
