import { z } from "zod";

const ProjectIdValidation = z
    .object({ projectId: z.string() })
    .strict()
    .required();

export const getProjectData = z.object({
    params: ProjectIdValidation,
});

export const saveProjectData = z.object({
    body: z.object({
        data: z.object({
            name: z.string(),
            elevatorPitch: z.string(),
            summary: z.string(),
            teamOverview: z.string(),
            slideLink: z.string(),
        }),
    }),
});