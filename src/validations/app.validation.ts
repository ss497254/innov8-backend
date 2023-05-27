import { z } from "zod";

const AppNameValidation = z.object({ appName: z.string() }).required();

export const getAppData = z.object({
    params: AppNameValidation,
});

export const saveAppData = z.object({
    params: AppNameValidation,
    body: z
        .object({
            data: z.object({}),
        })
        .required(),
});
