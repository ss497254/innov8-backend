import express from "express";
import { interviewController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { interviewValidation } from "../validations";

const router = express.Router();

router
    .route("/coach/interviews")
    .get(authProvider("coach"), interviewController.getInterviewsForCoach);

router
    .route("/employee/interviews")
    .get(authProvider("employee"), interviewController.getInterviews);

router
    .route("/employee/interviews/:projectId")
    .get(
        authProvider("employee"),
        validate(
            interviewValidation.getInterviewById,
            interviewController.getInterviewById
        )
    )
    .post(
        authProvider("employee"),
        validate(
            interviewValidation.saveInterview,
            interviewController.saveInterview
        )
    )
    .delete(authProvider("employee"));

export default router;
