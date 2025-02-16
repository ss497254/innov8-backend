import { z } from "zod";
import { UserValidation } from "./user.validation";

const ProjectIdValidation = z.object({ projectId: z.string() }).strict();

export const getProjectsById = z.object({
    params: ProjectIdValidation,
});

export const addJudgeToProject = z.object({
    params: ProjectIdValidation,
    body: z.object({
        judge: UserValidation,
    }),
});

export const addCoachToProject = z.object({
    params: ProjectIdValidation,
    body: z.object({
        coach: UserValidation,
    }),
});

export const addReviewToProject = z.object({
    params: ProjectIdValidation,
    body: z.object({
        overallRating: z.number(),
        rating: z.any(),
    }),
});

export const addProjectForIdeaValidation = z.object({
    body: ProjectIdValidation,
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
            teamMembers: z.array(UserValidation),
        }),
    }),
});
