import { z } from "zod";
import { UserValidation } from "./user.validation";

const interviewValidation = z.object({ interviewId: z.string() }).strict();

export const getInterviewById = z.object({
    params: interviewValidation,
});

export const saveInterview = z.object({
    body: z.object({
        interviewTitle: z.string(),
        projectId: z.string(),
        name: z.string(),
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
