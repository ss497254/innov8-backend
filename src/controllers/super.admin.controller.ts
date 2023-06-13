import { Request, Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { superAdminService } from "../services";
import {
    createAccessToken,
    removeAccessToken,
    sendAccessToken,
} from "../utils/UseAccessToken";
import { userValidation } from "../validations";

export const superAdminLogin = async (
    data: z.infer<typeof userValidation.userLogin>,
    res: Response
) => {
    const { email, password } = data.body;

    try {
        const user = await superAdminService.getSuperAdminByEmailAndPassword(
            email,
            password
        );

        const token = createAccessToken(user);

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

export const superAdminRegister = async (
    req: z.infer<typeof userValidation.userRegister>,
    res: Response
) => {
    try {
        const data = await superAdminService.addSuperAdmin(req.body);

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

export const getSuperAdmin = async (req: Request, res: Response) => {
    const id = req.session.id;

    try {
        const user = await superAdminService.getSuperAdmin(id);

        res.json({ success: true, data: user });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "user not found", e).parse(res);
    }
};

export const logout = (_: Request, res: Response) => {
    removeAccessToken(res);

    res.json({ success: true, message: "logout successful" });
};
