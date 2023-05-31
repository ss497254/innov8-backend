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

export const getProjects = async () => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getProjectsById = async (projectId: string) => {
    return await getItemById(ScreeningTableName, projectId);
};

// admin
export const getProjectsForAdmin = async () => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addJudgeToProject = async (
    projectId: string,
    judgeEmail: string
) => {
    return await updateItem(ScreeningTableName, projectId, { judgeEmail });
};

// judge
export const getProjectsForJudge = async () => {
    return (
        await (await getCollectionData(ScreeningTableName))
            .select("name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addReviewToProject = async (projectId: string, data: any) => {
    return await updateItem(ScreeningTableName, projectId, data);
};

export const getProjectsFromDraft = async () => {
    return await getCollectionData(DraftsTableName);
};

export const saveProject = async (
    type: z.infer<typeof projectValidation.saveProject>["body"]["type"],
    data: z.infer<typeof projectValidation.saveProject>["body"]["data"]
) => {
    if (type === "draft") return await addItem(DraftsTableName, data);
    else if (type === "submit") return await addItem(ScreeningTableName, data);

    throw new Error("Invalid form type");
};
