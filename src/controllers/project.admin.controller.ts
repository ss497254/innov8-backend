import { Request, Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { projectService } from "../services";
import { projectValidation } from "../validations";

export const getProjects = async (_req: Request, res: Response) => {
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

export const addJudgeToProject = async (
    req: z.infer<typeof projectValidation.addJudgeToProject>,
    res: Response
) => {
    try {
        const data = await projectService.addJudgeToProject(
            req.params.projectId,
            req.body.email
        );
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to add judge to project",
            e
        ).parse(res);
    }
};
