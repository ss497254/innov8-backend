import { getEnvConfig, __prod__ } from "../config";
import { request } from "gaxios";
import { userService } from ".";

const scope = "https://www.googleapis.com/auth/userinfo.email";

export const generateAuthUrl = (redirect_uri: string) => {
    const options: Record<string, string> = {
        response_type: "code",
        client_id: getEnvConfig("GOOGLE_CLIENT_ID"),
        redirect_uri,
        scope,
    };

    return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
        options
    )}`;
};

export const getUserFromCode = async (code: string, redirect_uri: string) => {
    let x = new Error("Some error occured, please try again. [24523]");

    const {
        data: { access_token },
    } = (await request({
        method: "POST",
        url: "https://oauth2.googleapis.com/token",
        data: new URLSearchParams({
            code,
            client_id: getEnvConfig("GOOGLE_CLIENT_ID"),
            client_secret: getEnvConfig("GOOGLE_CLIENT_SECRET"),
            grant_type: "authorization_code",
            redirect_uri,
            scope,
        }).toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })) as any;

    if (!access_token) throw x;

    const { data }: any = await request({
        url: "https://www.googleapis.com/oauth2/v2/userinfo",
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!data.email) throw x;

    return await userService.getUserByEmail(data.email);
};
