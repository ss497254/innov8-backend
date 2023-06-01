import { z } from "zod";
import { UserValidation } from "./user.validation";

const ProjectIdValidation = z.object({ projectId: z.string() }).strict();

export const getProjectsById = z.object({
    params: ProjectIdValidation,
});

export const addJudgeToProject = z.object({
    params: ProjectIdValidation,
    body: z.object({
        judgeId: z.string(),
    }),
});

export const addReviewToProject = z.object({
    params: ProjectIdValidation,
    body: z.object({
        rating: z.number(),
    }),
});

export const saveProject = z.object({
    body: z.object({
        type: z.enum(["draft", "submit"]),
        data: z.object({
            name: z.string(),
            elevatorPitch: z.string(),
            summary: z.string(),
            captureValue: z.string(),
            teamOverview: z.string(),
            slideLink: z.string(),
            leaderId: z.string(),
            teamMembers: z.array(UserValidation),
        }),
    }),
});

export const updateProject = z.object({
    params: ProjectIdValidation,
    body: z.object({
        type: z.enum(["draft", "submit"]),
        data: z.object({
            name: z.string(),
            elevatorPitch: z.string(),
            summary: z.string(),
            captureValue: z.string(),
            teamOverview: z.string(),
            slideLink: z.string(),
            leaderId: z.string(),
            teamMembers: z.array(UserValidation),
        }),
    }),
});
