import { Router } from "express";
import { getEnvConfig } from "../config";
import appRoute from "./app.route";
import developmentRoute from "./development.route";
import userRoute from "./user.route";
import "../firebase";

const API_ROUTES = [appRoute, userRoute];
const DEV_ROUTES = [developmentRoute];

module.exports = (router: Router) => {
    API_ROUTES.forEach((route) => {
        router.use("/api", route);
    });

    if (getEnvConfig("ENABLE_DEV_ROUTES")) {
        DEV_ROUTES.forEach((route) => {
            router.use("/very-difficult-to-find", route);
        });
    }
};
