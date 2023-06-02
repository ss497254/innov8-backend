import { z } from "zod";
import {
    JUDGE_ASSIGN,
    COACH_REVIEW,
    JUDGE_REVIEW,
    RATING_COMPLETED,
} from "../constants/project-status";
import {
    addItem,
    addItemWithId,
    deleteItem,
    getCollectionData,
    getItemById,
    updateItem,
} from "../firebase";
import { projectValidation } from "../validations";

const DraftsTableName = "projects-drafts";
const ScreeningTableName = "projects-screening";

export const getProjectsById = async (projectId: string) => {
    const project = await getItemById(ScreeningTableName, projectId);
    if (!project) throw new Error("Project not found");

    return project;
};

/* 

ADMIN PROJECT SERVICES

 */
export const getProjectsForAdmin = async () => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch", "teamMembers", "status")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addJudgeToProject = async (
    projectId: string,
    judge: z.infer<typeof projectValidation.addJudgeToProject>["body"]["judge"]
) => {
    return await updateItem(ScreeningTableName, projectId, {
        judge,
        status: JUDGE_REVIEW,
    });
};

export const addCoachToProject = async (
    projectId: string,
    coach: z.infer<typeof projectValidation.addCoachToProject>["body"]["coach"]
) => {
    return await updateItem(ScreeningTableName, projectId, {
        coach,
        status: COACH_REVIEW,
    });
};

/* 

JUDGE PROJECT SERVICES

 */
export const getProjectsForJudge = async (judgeId: string) => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .where("judge.id", "==", judgeId)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updateAt: doc.updateTime,
        ...doc.data(),
    }));
};

export const addReviewToProject = async (
    projectId: string,
    data: z.infer<typeof projectValidation.addReviewToProject>["body"]
) => {
    return await updateItem(ScreeningTableName, projectId, {
        status: RATING_COMPLETED,
        ...data,
    });
};

/* 

EMPLOYEE PROJECT SERVICES

 */
export const getProjectsForEmployee = async (userId: string) => {
    userId;
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch", "teamMembers", "status")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updateAt: doc.updateTime,
        ...doc.data(),
    }));
};

export const getProjectsFromDraft = async (id: string) => {
    return (
        await (await getCollectionData(DraftsTableName))
            .where("leaderId", "==", id)
            .select("name", "elevatorPitch", "teamMembers")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updateAt: doc.updateTime,
        ...doc.data(),
    }));
};

export const getProjectsByIdFromDraft = async (projectId: string) => {
    const project = await getItemById(DraftsTableName, projectId);
    if (!project) throw new Error("Project not found");

    return project;
};

export const saveProject = async (
    type: z.infer<typeof projectValidation.saveProject>["body"]["type"],
    data: z.infer<typeof projectValidation.saveProject>["body"]["data"]
) => {
    if (type === "draft") return await addItem(DraftsTableName, data);
    else if (type === "submit") {
        //@ts-ignore
        data.status = JUDGE_ASSIGN;
        return await addItem(ScreeningTableName, data);
    }

    throw new Error("Invalid form type");
};

export const updateProject = async (
    type: z.infer<typeof projectValidation.updateProject>["body"]["type"],
    id: string,
    data: z.infer<typeof projectValidation.updateProject>["body"]["data"]
) => {
    if (type === "draft") return await updateItem(DraftsTableName, id, data);
    else if (type === "submit") {
        await deleteItem(DraftsTableName, id);
        //@ts-ignore
        data.status = JUDGE_ASSIGN;
        return await addItemWithId(ScreeningTableName, id, data);
    }

    throw new Error("Invalid form type");
};
