import { Request, Response } from "express";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { projectFormService } from "../services";

export const getProjectForm = async (_req: Request, res: Response) => {
    try {
        const projectForm = await projectFormService.getProjectForm();

        res.json({ success: true, data: projectForm });
    } catch (e) {
        new ApiError(httpStatus.BAD_REQUEST, "project form not found", e).parse(
            res
        );
    }
};

export const updateProjectForm = async (req: Request, res: Response) => {
    try {
        const projectForm = await projectFormService.updateProjectForm(
            req.body
        );

        res.json({ success: true, data: projectForm });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to update project form",
            e
        ).parse(res);
    }
};
