import express from "express";
import { projectController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/admin/projects")
    .get(authProvider("admin"), projectController.getProjectsFromScreening);

router
    .route("/admin/projects/:projectId/add-judge")
    .post(
        authProvider("admin"),
        validate(
            projectValidation.addJudgeToProject,
            projectController.addJudgeToProject
        )
    );

router
    .route("/admin/projects/:projectId")
    .get(
        authProvider("admin"),
        validate(
            projectValidation.getProjectsById,
            projectController.getProjectsById
        )
    );

router
    .route("/judge/projects/:projectId")
    .get(
        authProvider("judge"),
        validate(
            projectValidation.getProjectsById,
            projectController.getProjectsById
        )
    );

router
    .route("/employee/projects/drafts")
    .get(authProvider("employee"), projectController.getProjectsFromDraft);

router
    .route("/employee/projects/screening")
    .get(authProvider("employee"), projectController.getProjectsFromScreening);

router
    .route("/employee/projects/:projectId")
    .get(
        authProvider("employee"),
        validate(
            projectValidation.getProjectsById,
            projectController.getProjectsById
        )
    )
    .put(authProvider("employee"))
    .delete(authProvider("employee"));

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
