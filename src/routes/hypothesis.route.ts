import express from "express";
import { hypothesisController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { hypothesisValidation } from "../validations";

const router = express.Router();

router
    .route("/employee/hypotheses")
    .get(authProvider("employee"), hypothesisController.getHypotheses);

router
    .route("/employee/hypotheses/:projectId")
    .get(
        authProvider("employee"),
        validate(
            hypothesisValidation.getHypothesisById,
            hypothesisController.getHypothesisById
        )
    )
    .post(
        authProvider("employee"),
        validate(
            hypothesisValidation.saveHypothesis,
            hypothesisController.saveHypothesis
        )
    )
    .delete(authProvider("employee"));

export default router;
