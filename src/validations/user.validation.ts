import { z } from "zod";

export const userLogin = z.object({
    body: z
        .object({
            email: z.string({ required_error: "email is required" }),
            password: z.string({ required_error: "password is required" }),
        })
        .strict(),
});

export const userRegister = z.object({
    body: z
        .object({
            firstName: z.string({ required_error: "firstName is required" }),
            lastName: z.string({ required_error: "lastName is required" }),
            email: z.string({ required_error: "email is required" }),
            password: z.string({ required_error: "password is required" }),
        })
        .strict(),
});

export const findUser = z.object({
    query: z.object({ email: z.string().email() }).strict(),
});
