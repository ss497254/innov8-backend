import { z } from "zod";
import {
    addItem,
    addItemWithId,
    deleteItem,
    getCollectionData,
    getItemById,
    updateItem,
} from "../firebase";
import { UserType } from "../types/UserType";
import { projectValidation } from "../validations";

const DraftsTableName = "projects-drafts";
const ScreeningTableName = "projects-screening";

export const getProjectsById = async (projectId: string) => {
    const project = await getItemById(ScreeningTableName, projectId);
    if (!project) throw new Error("Project not found");

    return project;
};

// admin
export const getProjectsForAdmin = async () => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch", "teamMembers")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addJudgeToProject = async (
    projectId: string,
    judge: z.infer<typeof projectValidation.addJudgeToProject>["body"]["judge"]
) => {
    return await updateItem(ScreeningTableName, projectId, { judge });
};

// judge
export const getProjectsForJudge = async (judgeId: string) => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .where("judge.id", "==", judgeId)
            .select("name", "elevatorPitch", "teamMembers")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updateAt: doc.updateTime,
        ...doc.data(),
    }));
};

export const addReviewToProject = async (projectId: string, data: any) => {
    return await updateItem(ScreeningTableName, projectId, data);
};

// employee
export const getProjectsForEmployee = async (userId: string) => {
    userId;
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch", "teamMembers")
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
    else if (type === "submit") return await addItem(ScreeningTableName, data);

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
        return await addItemWithId(ScreeningTableName, id, data);
    }

    throw new Error("Invalid form type");
};
