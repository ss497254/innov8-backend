import express from "express";
import validate from "../middlewares/validate";
import { authProvider } from "../middlewares/auth";
import { appValidation } from "../validations";
import { appController } from "../controllers";

const router = express.Router();

router
    .route("/:appName/get-app-data")
    .get(
        authProvider("employee"),
        validate(appValidation.getAppData, appController.getAppData)
    );

router
    .route("/:appName/save-app-data")
    .post(
        authProvider("employee"),
        validate(appValidation.saveAppData, appController.saveAppData)
    );

export default router;
