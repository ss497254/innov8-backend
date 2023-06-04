import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { addItemWithId, getItem, getItemById } from "../firebase";
import { UserType } from "../types/UserType";
import { removeKey } from "../utils/lodash";

const TableName = "coaches";

export const getCoach = async (id: string) => {
    const user: any = (await getItem(TableName, "id", "==", id))[0];

    if (!user) throw new Error("User not found!");

    return removeKey<UserType>("password", user);
};

export const getCoachByEmail = async (
    email: string,
    withPassword = false
): Promise<UserType> => {
    const user: any = (await getItemById(TableName, email)).data();

    if (!user) throw new Error("User not found!");

    if (withPassword) return user;

    return removeKey("password", user);
};

export const getCoachByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getCoachByEmail(email, true);
    if (await bcrypt.compare(password, user.password))
        return removeKey<UserType>("password", user);

    throw new Error("password not match");
};

export const addCoach = async (user: UserType | any) => {
    user.id = v4();
    user.role = "coach";
    user.avatarUrl =
        "https://api.dicebear.com/6.x/bottts-neutral/svg?radius=50&seed=" +
        user.id;
    user.password = await bcrypt.hash(user.password, 4);

    return await addItemWithId(TableName, user.email, removeKey("email", user));
};
