import express from "express";
import { projectScoreController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectScoreValidation } from "../validations";

const router = express.Router();

router
    .route("/coach/project-score-all/:projectId")
    .get(
        authProvider("coach"),
        validate(
            projectScoreValidation.getScoreByProjectId,
            projectScoreController.getScoreByProjectId
        )
    );

router
    .route("/coach/project-score/:interviewId")
    .get(
        authProvider("coach"),
        validate(
            projectScoreValidation.getScoreById,
            projectScoreController.getScoreById
        )
    )
    .post(
        authProvider("coach"),
        validate(
            projectScoreValidation.saveProjectScore,
            projectScoreController.saveProjectScore
        )
    );

router
    .route("/employee/project-score-all/:projectId")
    .get(
        authProvider("employee"),
        validate(
            projectScoreValidation.getScoreByProjectId,
            projectScoreController.getScoreByProjectId
        )
    );

router
    .route("/employee/project-score/:interviewId")
    .get(
        authProvider("employee"),
        validate(
            projectScoreValidation.getScoreById,
            projectScoreController.getScoreById
        )
    )
    .post(
        authProvider("employee"),
        validate(
            projectScoreValidation.saveProjectScore,
            projectScoreController.saveProjectScore
        )
    )
    .delete(authProvider("employee"));

export default router;
