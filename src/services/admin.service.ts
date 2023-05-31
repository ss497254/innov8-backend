import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { addItemWithId, getItem, getItemById } from "../firebase";
import { UserType } from "../types/UserType";
import { removeKey } from "../utils/lodash";

const TableName = "admins";

export const getAdmin = async (id: string) => {
    const user: any = (await getItem(TableName, "id", "==", id))[0];

    if (!user) throw new Error("User not found!");

    return removeKey<UserType>("password", user);
};

export const getAdminByEmail = async (
    email: string,
    withPassword = false
): Promise<UserType> => {
    const user: any = await getItemById(TableName, email);

    if (!user) throw new Error("User not found!");

    if (withPassword) return user;

    return removeKey("password", user);
};

export const getAdminByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getAdminByEmail(email, true);
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
