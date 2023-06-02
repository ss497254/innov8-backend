import { coachController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router.route("/coach/me").get(authProvider("coach"), coachController.getCoach);

router
    .route("/coach/login")
    .post(validate(userValidation.userLogin, coachController.coachLogin));

router
    .route("/coach/register/")
    .post(validate(userValidation.userRegister, coachController.coachRegister));

export default router;
