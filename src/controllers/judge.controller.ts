import { Request, Response } from "express";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { judgeService } from "../services";
import { z } from "zod";
import { createAccessToken, sendAccessToken } from "../utils/UseAccessToken";
import { userValidation } from "../validations";

export const judgeLogin = async (
    data: z.infer<typeof userValidation.userLogin>,
    res: Response
) => {
    const { email, password } = data.body;

    try {
        const user = await judgeService.getJudgeByEmailAndPassword(
            email,
            password
        );

        user.role = "judge";

        const token = createAccessToken({ id: user.id });

        sendAccessToken(res, token);

        res.status(httpStatus.OK).send({
            success: true,
            message: "Login successful",
            data: user,
        });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "unable to login user", e).parse(
            res
        );
    }
};

export const judgeRegister = async (
    req: z.infer<typeof userValidation.userRegister>,
    res: Response
) => {
    try {
        const data = await judgeService.addJudge(req.body);

        res.status(httpStatus.CREATED).send({
            success: true,
            message: "register successful",
            data,
        });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to register user",
            e
        ).parse(res);
    }
};

export const getJudge = async (req: Request, res: Response) => {
    const id = req.session.id;

    try {
        const user = await judgeService.getJudge(id);

        res.json({ success: true, data: user });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "user not found", e).parse(res);
    }
};
