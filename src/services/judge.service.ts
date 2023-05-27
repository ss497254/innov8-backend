import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { addItemWithId, getItem } from "../firebase";
import { UserType } from "../types/UserType";
import { removeKey } from "../utils/lodash";

const TableName = "judges";

export const getJudgeByEmail = async (email: string) => {
    const result: any = await getItem(TableName, email);

    if (!result) throw new Error("User not found!");

    return result as UserType;
};

export const getJudgeByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getJudgeByEmail(email);
    if (await bcrypt.compare(password, user.password))
        return removeKey("password", user);

    throw new Error("password not match");
};

export const addJudge = async (user: Omit<UserType, "id">) => {
    user.password = await bcrypt.hash(user.password, 4);

    return await addItemWithId(TableName, user.email, {
        id: v4(),
        ...removeKey("email", user),
    });
};
