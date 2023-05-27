import bcrypt from "bcryptjs";
import { addItemWithId, getItem } from "../firebase";
import { UserType } from "../types/UserType";

const TableName = "users";

export const getUserByEmail = async (email: string) => {
    const result: any = await getItem(TableName, email);

    return result as UserType;
};

export const getUserByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getUserByEmail(email);
    if (await bcrypt.compare(password, user.password)) return user;

    throw new Error("password not match");
};

export const addUser = async (email: string, password: string) => {
    password = await bcrypt.hash(password, 4);

    return await addItemWithId(TableName, email, { password });
};
