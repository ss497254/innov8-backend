import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import {
    SuperAdminConfigTable,
    SuperAdminsTable,
} from "../constants/table-names";
import { addItemWithId, getItem, getItemById, updateItem } from "../firebase";
import { UserType } from "../types/UserType";
import { removeKey } from "../utils/lodash";

export const getSuperAdmin = async (id: string) => {
    const user: any = (await getItem(SuperAdminsTable, "id", "==", id))[0];

    if (!user) throw new Error("User not found!");

    return removeKey<UserType>("password", user);
};

export const getSuperAdminByEmail = async (
    email: string,
    withPassword = false
): Promise<UserType> => {
    const user: any = (await getItemById(SuperAdminsTable, email)).data();

    if (!user) throw new Error("User not found!");

    if (withPassword) return user;

    return removeKey("password", user);
};

export const getSuperAdminByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getSuperAdminByEmail(email, true);
    if (await bcrypt.compare(password, user.password))
        return removeKey<UserType>("password", user);

    throw new Error("password not match");
};

export const addSuperAdmin = async (user: UserType | any) => {
    user.id = v4();
    user.role = "super-admin";
    user.avatarUrl =
        "https://api.dicebear.com/6.x/bottts-neutral/svg?radius=50&seed=" +
        user.id;
    user.password = await bcrypt.hash(user.password, 4);

    return await addItemWithId(
        SuperAdminsTable,
        user.email,
        removeKey("email", user)
    );
};
