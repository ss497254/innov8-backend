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
    .get(authProvider("employee"), interviewController.getInterviews)
    .post(
        authProvider("employee"),
        validate(
            interviewValidation.saveInterview,
            interviewController.saveInterview
        )
    );

router
    .route("/employee/interviews/:interviewId")
    .get(
        authProvider("employee"),
        validate(
            interviewValidation.getInterviewById,
            interviewController.getInterviewById
        )
    )
    .delete(authProvider("employee"));

export default router;
