import { SuperAdminConfigTable } from "../constants/table-names";
import { getItemById, updateItem } from "../firebase";

export const getProjectForm = async () => {
    return (await getItemById(SuperAdminConfigTable, "project-form")).data();
};

export const updateProjectForm = async (data: any) => {
    return await updateItem(SuperAdminConfigTable, "project-form", data);
};
