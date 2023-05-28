import { z } from "zod";

const ProjectIdValidation = z.object({ projectId: z.string() }).strict();

export const getProjectData = z
    .object({
        params: ProjectIdValidation,
    })
    .strict();

export const getProjectsById = z
    .object({
        params: ProjectIdValidation,
    })
    .strict();

export const addJudgeToProject = z
    .object({
        params: ProjectIdValidation,
        body: z.object({
            email: z.string(),
        }),
    })
    .strict();

export const saveProjectData = z
    .object({
        body: z.object({
            type: z.enum(["draft", "submit"]),
            data: z.object({
                name: z.string(),
                elevatorPitch: z.string(),
                summary: z.string(),
                teamOverview: z.string(),
                slideLink: z.string(),
            }),
        }),
    })
    .strict();
