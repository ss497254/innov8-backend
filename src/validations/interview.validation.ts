import { z } from "zod";
import { UserValidation } from "./user.validation";

const projectIdValidation = z.object({ projectId: z.string() }).strict();

export const getInterviewById = z.object({
    params: projectIdValidation,
});

export const saveInterview = z.object({
    params: projectIdValidation,
    body: z.object({
        hypotheses: z.array(
            z.object({
                hypothesis: z.string(),
                questions: z.array(z.string()),
            })
        ),
        teamMembers: z.array(UserValidation),
        coach: UserValidation,
    }),
});
