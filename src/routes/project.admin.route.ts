import express from "express";
import { projectAdminController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/admin/projects")
    .get(authProvider("admin"), projectAdminController.getProjects);

router
    .route("/admin/projects/:projectId")
    .get(
        authProvider("admin"),
        validate(
            projectValidation.getProjectsById,
            projectAdminController.getProjectsById
        )
    );

router
    .route("/admin/projects/:projectId/add-judge")
    .post(
        authProvider("admin"),
        validate(
            projectValidation.addJudgeToProject,
            projectAdminController.addJudgeToProject
        )
    );

router
    .route("/admin/projects/:projectId/add-coach")
    .post(
        authProvider("admin"),
        validate(
            projectValidation.addCoachToProject,
            projectAdminController.addCoachToProject
        )
    );

export default router;
