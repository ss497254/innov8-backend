import { Request, Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { hypothesisService } from "../services";
import { hypothesisValidation } from "../validations";

export const getProjectsWithHypotheses = async (
    req: Request,
    res: Response
) => {
    try {
        const data = await hypothesisService.getProjectsWithHypotheses(
            req.session.id
        );

        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get projects with hypotheses",
            e
        ).parse(res);
    }
};

export const getHypotheses = async (_req: Request, res: Response) => {
    try {
        const data = await hypothesisService.getHypotheses();

        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get hypotheses",
            e
        ).parse(res);
    }
};

export const getHypothesisById = async (
    req: z.infer<typeof hypothesisValidation.getHypothesisById>,
    res: Response
) => {
    try {
        const data = await hypothesisService.getHypothesisById(
            req.params.projectId
        );
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get hypothesis data",
            e
        ).parse(res);
    }
};

export const saveHypothesis = async (
    req: z.infer<typeof hypothesisValidation.saveHypothesis>,
    res: Response
) => {
    try {
        const output = await hypothesisService.saveHypothesis(
            req.params.projectId,
            req.body
        );
        res.send({ success: true, data: output });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to save hypothesis data",
            e
        ).parse(res);
    }
};
