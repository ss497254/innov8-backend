import { z } from "zod";
import {
    addItem,
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

// admin
export const getProjectsForAdmin = async () => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addJudgeToProject = async (projectId: string, judgeId: string) => {
    return await updateItem(ScreeningTableName, projectId, { judgeId });
};

// judge
export const getProjectsForJudge = async (judgeId: string) => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .where("judgeId", "==", judgeId)
            .select("name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addReviewToProject = async (projectId: string, data: any) => {
    return await updateItem(ScreeningTableName, projectId, data);
};

// employee
export const getProjectsForEmployee = async (userId: string) => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch")
            .where("teamMember", "array-contains", userId)
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getProjectsFromDraft = async () => {
    return (
        await (await getCollectionData(DraftsTableName))
            .select("name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    type: z.infer<typeof projectValidation.saveProject>["body"]["type"],
    id: string,
    data: z.infer<typeof projectValidation.saveProject>["body"]["data"]
) => {
    if (type === "draft") return await updateItem(DraftsTableName, id, data);
    else if (type === "submit")
        return await updateItem(ScreeningTableName, id, data);

    throw new Error("Invalid form type");
};
