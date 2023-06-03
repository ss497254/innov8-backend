import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { addItemWithId, getItem, getItemById } from "../firebase";
import { UserType } from "../types/UserType";
import { removeKey } from "../utils/lodash";

const TableName = "judges";

export const getJudge = async (id: string) => {
    const user: any = (await getItem(TableName, "id", "==", id))[0];

    if (!user) throw new Error("User not found!");

    return removeKey<UserType>("password", user);
};

export const getJudgeByEmail = async (
    email: string,
    withPassword = false
): Promise<UserType> => {
    const user: any = await getItemById(TableName, email);

    if (!user) throw new Error("User not found!");

    if (withPassword) return user;

    return removeKey("password", user);
};

export const getJudgeByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getJudgeByEmail(email, true);
    if (await bcrypt.compare(password, user.password))
        return removeKey<UserType>("password", user);

    throw new Error("password not match");
};

export const addJudge = async (user: UserType | any) => {
    user.id = v4();
    user.role = "judge";
    user.avatarUrl =
        "https://api.dicebear.com/6.x/bottts-neutral/svg?radius=50&seed=" +
        user.id;
    user.password = await bcrypt.hash(user.password, 4);

    return await addItemWithId(TableName, user.email, removeKey("email", user));
};
