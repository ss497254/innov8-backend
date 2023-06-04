import express from "express";
import { projectCoachController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/coach/projects")
    .get(authProvider("coach"), projectCoachController.getProjects);

router
    .route("/coach/projects/:projectId")
    .get(
        authProvider("coach"),
        validate(
            projectValidation.getProjectsById,
            projectCoachController.getProjectsById
        )
    );

router
    .route("/coach/projects/:projectId/add-review")
    .post(
        authProvider("coach"),
        validate(
            projectValidation.addReviewToProject,
            projectCoachController.addReviewToProject
        )
    );

export default router;
