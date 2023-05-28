import express from "express";
import { projectController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/admin/get-projects")
    .get(authProvider("admin"), projectController.getProjectsFromScreening);

router
    .route("/employee/get-projects/drafts")
    .get(authProvider("employee"), projectController.getProjectsFromDraft);

router
    .route("/employee/get-projects/screening")
    .get(authProvider("employee"), projectController.getProjectsFromScreening);

router
    .route("/employee/get-project/:projectId")
    .get(
        authProvider("employee"),
        validate(
            projectValidation.getProjectsById,
            projectController.getProjectsById
        )
    )
    .put(authProvider("employee"));

router
    .route("/employee/save-project")
    .post(
        authProvider("employee"),
        validate(
            projectValidation.saveProjectData,
            projectController.saveProjectData
        )
    );

export default router;
