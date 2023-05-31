import { z } from "zod";

const ProjectIdValidation = z.object({ projectId: z.string() }).strict();

export const getProjectsById = z.object({
    params: ProjectIdValidation,
});

export const addJudgeToProject = z.object({
    params: ProjectIdValidation,
    body: z.object({
        email: z.string(),
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
        }),
    }),
});
