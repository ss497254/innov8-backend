import { z } from "zod";

const projectIdValidation = z.object({ projectId: z.string() }).strict();
const interviewValidation = z.object({ interviewId: z.string() }).strict();

export const getScoreByProjectId = z.object({
    params: projectIdValidation,
});

export const getScoreById = z.object({
    params: interviewValidation,
});

export const saveProjectScore = z.object({
    params: interviewValidation,
    body: z.object({
        role: z.string(),
        projectId: z.string(),
        userId: z.string(),
        score: z.array(
            z.object({
                hypothesis: z.array(z.number()),
            })
        ),
        review: z.string().optional(),
    }),
});
