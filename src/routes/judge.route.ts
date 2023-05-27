import { judgeController } from "../controllers";
import express from "express";
import validate from "../middlewares/validate";
import { userValidation } from "../validations";
import { auth } from "../middlewares/auth";

const router = express.Router();

router.route("/judge/logged-in").get(auth, judgeController.judgeLoggedIn);

router
    .route("/judge/login")
    .post(validate(userValidation.userLogin, judgeController.judgeLogin));

router
    .route("/judge/register/")
    .post(validate(userValidation.userRegister, judgeController.judgeRegister));

export default router;
