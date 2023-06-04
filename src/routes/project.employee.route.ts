import express from "express";
import { projectEmployeeController } from "../controllers";
import { authProvider } from "../middlewares/auth";
import validate from "../middlewares/validate";
import { projectValidation } from "../validations";

const router = express.Router();

router
    .route("/employee/projects/idea-generation")
    .get(
        authProvider("employee"),
        projectEmployeeController.getProjectsFromDraft
    );

router
    .route("/employee/projects/idea-generation/:projectId")
    .get(
        authProvider("employee"),
        validate(
            projectValidation.getProjectsById,
            projectEmployeeController.getProjectsByIdFromDraft
        )
    );

router
    .route("/employee/projects/idea-validation")
    .get(
        authProvider("employee"),
        projectEmployeeController.getProjectsFromValidation
    )
    .post(
        authProvider("employee"),
        validate(
            projectValidation.addProjectForIdeaValidation,
            projectEmployeeController.addProjectForIdeaValidation
        )
    );

router
    .route("/employee/projects/idea-validation/:projectId")
    .get(
        authProvider("employee"),
        validate(
            projectValidation.getProjectsById,
            projectEmployeeController.getProjectsByIdFromValidation
        )
    );

router
    .route("/employee/projects")
    .get(authProvider("employee"), projectEmployeeController.getProjects)
    .post(
        authProvider("employee"),
        validate(
            projectValidation.saveProject,
            projectEmployeeController.saveProject
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
    .put(
        authProvider("employee"),
        validate(
            projectValidation.updateProject,
            projectEmployeeController.updateProject
        )
    )
    .delete(authProvider("employee"));

export default router;
