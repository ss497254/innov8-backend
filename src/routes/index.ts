import { Router } from "express";
import { getEnvConfig } from "../config";
import "../firebase";
import admin from "./admin.route";
import development from "./development.route";
import employee from "./employee.route";
import judge from "./judge.route";
import project from "./project.route";

const API_ROUTES = [project, employee, admin, judge];
const DEV_ROUTES = [development];

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
