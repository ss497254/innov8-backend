import express from "express";
import { projectJudgeController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/judge/projects")
    .get(authProvider("judge"), projectJudgeController.getProjects);

router
    .route("/judge/projects/:projectId")
    .get(
        authProvider("judge"),
        validate(
            projectValidation.getProjectsById,
            projectJudgeController.getProjectsById
        )
    );

export default router;
