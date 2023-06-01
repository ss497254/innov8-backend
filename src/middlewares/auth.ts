import { NextFunction, Request, Response } from "express";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";

export const authProvider =
    (role?: "employee" | "admin" | "judge") =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (
            req.session &&
            req.session.id &&
            (!role || req.session.role === role)
        ) {
            return next();
        }

        new ApiError(
            httpStatus.UNAUTHORIZED,
            "Please login to see this content"
        ).parse(res);

        return;
    };
