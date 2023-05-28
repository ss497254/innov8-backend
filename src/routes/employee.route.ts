import { employeeController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router
    .route("/employee/me")
    .get(authProvider("employee"), employeeController.getEmployee);

router
    .route("/employee/login")
    .post(validate(userValidation.userLogin, employeeController.employeeLogin));

router
    .route("/employee/register/")
    .post(
        validate(
            userValidation.userRegister,
            employeeController.employeeRegister
        )
    );

export default router;
