import { Request, Response } from "express";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { userManagementService } from "../services";

export const getAllAdmins = async (_req: Request, res: Response) => {
    try {
        const admins = await userManagementService.getAllAdmins();

        res.json({ success: true, data: admins });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "admins not found", e).parse(res);
    }
};

export const getAllCoaches = async (_req: Request, res: Response) => {
    try {
        const coaches = await userManagementService.getAllCoaches();

        res.json({ success: true, data: coaches });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "coaches not found", e).parse(res);
    }
};

export const getAllEmployees = async (_req: Request, res: Response) => {
    try {
        const employees = await userManagementService.getAllEmployees();

        res.json({ success: true, data: employees });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "employees not found", e).parse(
            res
        );
    }
};

export const getAllJudges = async (_req: Request, res: Response) => {
    try {
        const judges = await userManagementService.getAllJudges();

        res.json({ success: true, data: judges });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "judges not found", e).parse(res);
    }
};
