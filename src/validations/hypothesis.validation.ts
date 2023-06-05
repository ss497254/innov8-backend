import { z } from "zod";

const projectIdValidation = z.object({ projectId: z.string() }).strict();

export const getHypothesisById = z.object({
    params: projectIdValidation,
});

export const saveHypothesis = z.object({
    params: projectIdValidation,
    body: z.object({
        projectName: z.string(),
        hypotheses: z.array(
            z
                .object({
                    hypothesis: z.string(),
                    question_1: z.string(),
                    question_2: z.string(),
                    question_3: z.string(),
                    question_4: z.string(),
                    question_5: z.string(),
                })
                .partial()
        ),
    }),
});
