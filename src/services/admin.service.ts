import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { addItemWithId, getItem, getItemById } from "../firebase";
import { UserType } from "../types/UserType";
import { removeKey } from "../utils/lodash";

const TableName = "admins";

export const getAdmin = async (id: string) => {
    const result: any = (await getItem(TableName, "id", "==", id))[0];

    if (!result) throw new Error("User not found!");

    return result as UserType;
};

export const getAdminByEmail = async (email: string) => {
    const result: any = await getItemById(TableName, email);

    if (!result) throw new Error("User not found!");

    return result as UserType;
};

export const getAdminByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getAdminByEmail(email);
    if (await bcrypt.compare(password, user.password))
        return removeKey<UserType>("password", user);

    throw new Error("password not match");
};

export const addAdmin = async (user: Omit<UserType, "id">) => {
    user.role = "admin";
    user.password = await bcrypt.hash(user.password, 4);

    return await addItemWithId(TableName, user.email, {
        id: v4(),
        ...removeKey("email", user),
    });
};
