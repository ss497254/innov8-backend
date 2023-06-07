import { Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { projectScoreService } from "../services";
import { projectScoreValidation } from "../validations";

export const getScoreByProjectId = async (
    req: z.infer<typeof projectScoreValidation.getScoreByProjectId>,
    res: Response
) => {
    try {
        const data = await projectScoreService.getScoreByProjectId(
            req.params.projectId
        );
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get project score data",
            e
        ).parse(res);
    }
};

export const getScoreById = async (
    req: z.infer<typeof projectScoreValidation.getScoreById>,
    res: Response
) => {
    try {
        const data = await projectScoreService.getScoreById(
            req.params.interviewId
        );
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get project score data",
            e
        ).parse(res);
    }
};

export const saveProjectScore = async (
    req: z.infer<typeof projectScoreValidation.saveProjectScore>,
    res: Response
) => {
    try {
        const output = await projectScoreService.saveProjectScore(
            req.params.interviewId,
            req.body
        );
        res.send({ success: true, data: output });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to save project score data",
            e
        ).parse(res);
    }
};
