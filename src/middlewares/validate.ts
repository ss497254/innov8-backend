import { Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import httpStatus from "../constants/http-status";
import ApiError from "../lib/api-error";

const validate =
    (schema: AnyZodObject, cb: (x: any, res: Response) => void) =>
    (req: Request, res: Response) => {
        try {
            const data = schema.parse(req);
            cb(data, res);
        } catch (err) {
            let message = "validation error";

            if (err instanceof ZodError) {
                message = err.issues
                    .map((z) => z.message || `${z.path.at(-1)} is ${z.code}`)
                    .join(", ");
            }

            new ApiError(httpStatus.BAD_REQUEST, message, err).parse(res);
            res.end();
        }
    };

export default validate;
