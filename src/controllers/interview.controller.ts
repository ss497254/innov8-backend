import { Request, Response } from "express";
import { z } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";
import { interviewService } from "../services";
import { interviewValidation } from "../validations";

export const getInterviewsForCoach = async (req: Request, res: Response) => {
    try {
        const data = await interviewService.getInterviewsForCoach(
            req.session.id
        );

        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get coach interviews",
            e
        ).parse(res);
    }
};

export const getInterviews = async (req: Request, res: Response) => {
    try {
        const data = await interviewService.getInterviews(req.session.id);

        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get interviews",
            e
        ).parse(res);
    }
};

export const getInterviewById = async (
    req: z.infer<typeof interviewValidation.getInterviewById>,
    res: Response
) => {
    try {
        const data = await interviewService.getInterviewById(
            req.params.interviewId
        );
        res.send({ success: true, data });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to get interview data",
            e
        ).parse(res);
    }
};

export const saveInterview = async (
    req: z.infer<typeof interviewValidation.saveInterview>,
    res: Response
) => {
    try {
        const output = await interviewService.saveInterview(req.body);
        res.send({ success: true, data: output });
    } catch (e) {
        new ApiError(
            httpStatus.BAD_REQUEST,
            "unable to save interview data",
            e
        ).parse(res);
    }
};
