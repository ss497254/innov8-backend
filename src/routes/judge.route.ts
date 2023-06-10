import { judgeController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { authProvider } from "../middlewares/auth";

const router = express.Router();

router.route("/judge/me").get(authProvider("judge"), judgeController.getJudge);

router
    .route("/judge/login")
    .post(validate(userValidation.userLogin, judgeController.judgeLogin));

router
    .route("/judge/register/")
    .post(validate(userValidation.userRegister, judgeController.judgeRegister));

router
    .route("/judge/logout")
    .get(authProvider("judge"), judgeController.logout);

export default router;
