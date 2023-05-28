import { Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { projectService } from "../services";
import { projectValidation } from "../validations";

export const getProjectData = async (
    req: z.infer<typeof projectValidation.getProjectData>,
    res: Response
) => {
    const { projectId } = req.params;

    try {
        const data = await projectService.getProjectData(projectId);
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get project data",
            e
        ).parse(res);
    }
};

export const saveProjectData = async (
    req: z.infer<typeof projectValidation.saveProjectData>,
    res: Response
) => {
    try {
        const { id } = await projectService.saveProjectData(req.body.data);
        res.send({ success: true, data: { id } });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to save project data",
            e
        ).parse(res);
    }
};
