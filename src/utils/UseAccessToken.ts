import { getEnvConfig, __prod__ } from "../config";
import { Response } from "express";
import { sign } from "jsonwebtoken";
import { UserType } from "../types/UserType";

export const createAccessToken = (user: UserType) => {
    return sign(
        { id: user.id, role: user.role },
        getEnvConfig("COOKIE_SECRET"),
        {
            expiresIn: "365d",
            algorithm: "HS256",
        }
    );
};

export const sendAccessToken = (
    res: Response,
    token: string,
    path?: string
) => {
    res.cookie(getEnvConfig("COOKIE_NAME"), token, {
        maxAge: getEnvConfig("COOKIE_MAXAGE"),
        httpOnly: true,
        secure: getEnvConfig("COOKIE_SECURE"),
        sameSite: getEnvConfig("COOKIE_SAMESITE"),
        domain: __prod__ ? getEnvConfig("COOKIE_DOMAIN") : undefined,
        path,
    });
};

export const removeAccessToken = (res: Response, cookieName?: string) => {
    res.clearCookie(cookieName || getEnvConfig("COOKIE_NAME"), {
        sameSite: getEnvConfig("COOKIE_SAMESITE"),
        secure: getEnvConfig("COOKIE_SECURE"),
    });
};
