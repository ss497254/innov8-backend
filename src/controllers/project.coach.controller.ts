import { Request, Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { projectService } from "../services";
import { projectValidation } from "../validations";

export const getProjects = async (req: Request, res: Response) => {
    const { id } = req.session;

    try {
        const data = await projectService.getProjectsForCoach(id);
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get coach projects",
            e
        ).parse(res);
    }
};

export const getProjectsById = async (
    req: z.infer<typeof projectValidation.getProjectsById>,
    res: Response
) => {
    try {
        const data = await projectService.getProjectsByIdFromValidation(
            req.params.projectId
        );
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get coach project",
            e
        ).parse(res);
    }
};

export const addReviewToProject = async (
    req: z.infer<typeof projectValidation.addReviewToProject>,
    res: Response
) => {
    try {
        const data = await projectService.addReviewToProjectCoach(
            req.params.projectId,
            req.body
        );
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get project data",
            e
        ).parse(res);
    }
};
