import { Request, Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { projectService } from "../services";
import { projectValidation } from "../validations";

export const getProjectsFromDraft = async (_req: Request, res: Response) => {
    try {
        const data = await projectService.getProjectsFromDraft();
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get projects data",
            e
        ).parse(res);
    }
};

export const getProjectsFromScreening = async (
    _req: Request,
    res: Response
) => {
    try {
        const data = await projectService.getProjectsFromScreening();
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get projects data",
            e
        ).parse(res);
    }
};

export const getProjectsById = async (
    req: z.infer<typeof projectValidation.getProjectsById>,
    res: Response
) => {
    try {
        const data = await projectService.getProjectsById(req.params.projectId);
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
    const { type, data } = req.body;

    try {
        const { id } = await projectService.saveProjectData(type, data);
        res.send({ success: true, data: { id } });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to save project data",
            e
        ).parse(res);
    }
};
