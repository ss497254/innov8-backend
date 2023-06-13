import { Router } from "express";
import { getEnvConfig } from "../config";
import "../firebase";
import admin from "./admin.route";
import coach from "./coach.route";
import development from "./development.route";
import employee from "./employee.route";
import hypothesis from "./hypothesis.route";
import interview from "./interview.route";
import judge from "./judge.route";
import projectAdmin from "./project.admin.route";
import projectCoach from "./project.coach.route";
import projectEmployee from "./project.employee.route";
import projectJudge from "./project.judge.route";
import projectScore from "./project.score.route";
import superAdmin from "./super.admin.route";

const API_ROUTES = [
    admin,
    coach,
    employee,
    hypothesis,
    interview,
    judge,
    projectAdmin,
    projectCoach,
    projectEmployee,
    projectJudge,
    projectScore,
    superAdmin,
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
