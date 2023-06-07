import express from "express";
import { projectScoreController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectScoreValidation } from "../validations";

const router = express.Router();

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
