import { getEnvConfig } from "../config";
import { NextFunction, Request, Response } from "express";
import { getLogger } from "../handlers/logger";
import { verify } from "jsonwebtoken";
import { removeAccessToken } from "../utils/UseAccessToken";

const logger = getLogger("init");

export const InitRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies[getEnvConfig("COOKIE_NAME") as string];

    logger.log(
        req.hostname,
        req.path,
        req.body,
        req.query,
        req.params,
        token ? "token" : "no-token"
    );

    if (!token) {
        return next();
    }

    try {
        const payload = verify(token, getEnvConfig("COOKIE_SECRET") as string, {
            algorithms: ["HS256"],
        }) as any;

        req.session = payload;
    } catch (err) {
        removeAccessToken(res);
    }

    return next();
};
