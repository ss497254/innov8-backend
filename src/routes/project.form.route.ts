import express from "express";
import { projectFormController } from "../controllers";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router
    .route("/super-admin/project-form")
    .get(authProvider("super-admin"), projectFormController.getProjectForm)
    .put(authProvider("super-admin"), projectFormController.updateProjectForm);

router
    .route("/employee/project-form")
    .get(authProvider("employee"), projectFormController.getProjectForm);

export default router;
