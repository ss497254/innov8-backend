import { z } from "zod";
import { addItem, getCollectionData } from "../firebase";
import { projectValidation } from "../validations";

const DraftsTableName = "projects-drafts";
const ScreeningTableName = "projects-screening";

export const getProjectsFromDraft = async () => {
    return await getCollectionData(DraftsTableName);
};

export const getProjectsFromScreening = async () => {
    return await getCollectionData(ScreeningTableName);
};

export const getProjectsById = async (projectId: string) => {
    return await getCollectionData(projectId);
};

export const saveProjectData = async (
    type: z.infer<typeof projectValidation.saveProjectData>["body"]["type"],
    data: z.infer<typeof projectValidation.saveProjectData>["body"]["data"]
) => {
    if (type === "draft") return await addItem(DraftsTableName, data);
    else if (type === "submit") return await addItem(ScreeningTableName, data);

    throw new Error("Invalid form type");
};
