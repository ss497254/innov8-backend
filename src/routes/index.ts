import { Router } from "express";
import { getEnvConfig } from "../config";
import "../firebase";
import admin from "./admin.route";
import development from "./development.route";
import employee from "./employee.route";
import judge from "./judge.route";
import projectAdmin from "./project.admin.route";
import projectEmployee from "./project.employee.route";
import projectJudge from "./project.judge.route";

const API_ROUTES = [
    admin,
    employee,
    judge,
    projectAdmin,
    projectEmployee,
    projectJudge,
];
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
