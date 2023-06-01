import { Request, Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { projectService } from "../services";
import { projectValidation } from "../validations";

export const getProjects = async (req: Request, res: Response) => {
    try {
        const data = await projectService.getProjectsForEmployee(
            req.session.id
        );
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

export const getProjectsFromDraft = async (req: Request, res: Response) => {
    try {
        const data = await projectService.getProjectsFromDraft(req.session.id);
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get draft project",
            e
        ).parse(res);
    }
};

export const getProjectsByIdFromDraft = async (
    req: z.infer<typeof projectValidation.getProjectsById>,
    res: Response
) => {
    try {
        const data = await projectService.getProjectsByIdFromDraft(
            req.params.projectId
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

export const saveProject = async (
    req: z.infer<typeof projectValidation.saveProject>,
    res: Response
) => {
    const { type, data } = req.body;

    try {
        const { id } = await projectService.saveProject(type, data);
        res.send({ success: true, data: { id } });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to save project data",
            e
        ).parse(res);
    }
};

export const updateProject = async (
    req: z.infer<typeof projectValidation.updateProject>,
    res: Response
) => {
    const { projectId } = req.params;
    const { type, data } = req.body;

    try {
        const output = await projectService.updateProject(
            type,
            projectId,
            data
        );
        res.send({ success: true, data: output });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to update project data",
            e
        ).parse(res);
    }
};
