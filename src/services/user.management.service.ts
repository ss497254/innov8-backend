import {
    AdminsTable,
    CoachesTable,
    EmployeesTable,
    JudgesTable,
} from "../constants/table-names";
import { getCollectionData, getItemById, updateItem } from "../firebase";

// get
export const getAllAdmins = async () => {
    return (
        await getCollectionData(AdminsTable)
            .select("firstName", "lastName", "avatarUrl")
            .get()
    ).docs.map((x) => ({ id: x.id, ...x.data() }));
};
export const getAllCoaches = async () => {
    return (
        await getCollectionData(CoachesTable)
            .select("firstName", "lastName", "avatarUrl")
            .get()
    ).docs.map((x) => ({ id: x.id, ...x.data() }));
};
export const getAllJudges = async () => {
    return (
        await getCollectionData(JudgesTable)
            .select("firstName", "lastName", "avatarUrl")
            .get()
    ).docs.map((x) => ({ id: x.id, ...x.data() }));
};
export const getAllEmployees = async () => {
    return (
        await getCollectionData(EmployeesTable)
            .select("firstName", "lastName", "avatarUrl")
            .get()
    ).docs.map((x) => ({ id: x.id, ...x.data() }));
};

// update
export const updateAllAdmins = async (id: string, data: any) => {
    return await updateItem(AdminsTable, id, data);
};
export const updateAllCoaches = async (id: string, data: any) => {
    return await updateItem(CoachesTable, id, data);
};
export const updateAllJudges = async (id: string, data: any) => {
    return await updateItem(JudgesTable, id, data);
};
export const updateAllEmployees = async (id: string, data: any) => {
    return await updateItem(EmployeesTable, id, data);
};
