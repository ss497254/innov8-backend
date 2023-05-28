import { addItem, getCollectionData } from "../firebase";

const TableName = "projects";

export const getProjectData = async (appName: string) => {
    return await getCollectionData(appName);
};

export const saveProjectData = async (data: any) => {
    return await addItem(TableName, data);
};
