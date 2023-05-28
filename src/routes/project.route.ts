import express from "express";
import { projectController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/employee/get-project")
    .get(
        authProvider("employee"),
        validate(
            projectValidation.getProjectData,
            projectController.getProjectData
        )
    );

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
