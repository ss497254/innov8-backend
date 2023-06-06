import { z } from "zod";

const projectIdValidation = z.object({ projectId: z.string() }).strict();

export const getHypothesisById = z.object({
    params: projectIdValidation,
});

export const saveHypothesis = z.object({
    params: projectIdValidation,
    body: z.object({
        hypotheses: z.array(
            z.object({
                hypothesis: z.string(),
                questions: z.array(z.string()),
            })
        ),
    }),
});
