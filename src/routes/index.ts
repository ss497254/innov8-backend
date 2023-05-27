import { Router } from "express";
import { getEnvConfig } from "../config";
import "../firebase";
import adminRoute from "./admin.route";
import appRoute from "./app.route";
import developmentRoute from "./development.route";
import employeeRoute from "./employee.route";
import judgeRoute from "./judge.route";

const API_ROUTES = [appRoute, employeeRoute, adminRoute, judgeRoute];
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
