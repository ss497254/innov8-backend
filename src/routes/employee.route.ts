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
    .route("/employee/team-member")
    .get(
        authProvider("employee"),
        validate(
            userValidation.findUser,
            employeeController.getTeamMemberByEmail
        )
    );

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

router
    .route("/employee/logout")
    .get(authProvider("employee"), employeeController.logout);

export default router;
