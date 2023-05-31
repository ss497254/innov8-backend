import express from "express";
import { projectEmployeeController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/employee/projects/drafts")
    .get(
        authProvider("employee"),
        projectEmployeeController.getProjectsFromDraft
    );

router
    .route("/employee/projects")
    .get(
        authProvider("employee"),
        projectEmployeeController.getProjectsFromScreening
    )
    .post(
        authProvider("employee"),
        validate(
            projectValidation.saveProjectData,
            projectEmployeeController.saveProjectData
        )
    );

router
    .route("/employee/projects/:projectId")
    .get(
        authProvider("employee"),
        validate(
            projectValidation.getProjectsById,
            projectEmployeeController.getProjectsById
        )
    )
    .put(authProvider("employee"))
    .delete(authProvider("employee"));

export default router;
