import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import { EmployeesTable } from "../constants/table-names";
import { addItemWithId, getItem, getItemById } from "../firebase";
import { UserType } from "../types/UserType";
import { removeKey } from "../utils/lodash";

export const getEmployee = async (id: string) => {
    const user: any = (await getItem(EmployeesTable, "id", "==", id))[0];

    if (!user) throw new Error("User not found!");

    return removeKey<UserType>("password", user);
};

export const getEmployeeByEmail = async (
    email: string,
    withPassword = false
): Promise<UserType> => {
    const user: any = (await getItemById(EmployeesTable, email)).data();

    if (!user) throw new Error("User not found!");

    if (withPassword) return user;

    return removeKey("password", user);
};

export const getEmployeeByEmailAndPassword = async (
    email: string,
    password: string
) => {
    const user = await getEmployeeByEmail(email, true);
    if (await bcrypt.compare(password, user.password))
        return removeKey<UserType>("password", user);

    throw new Error("password not match");
};

export const addEmployee = async (user: UserType | any) => {
    user.id = v4();
    user.role = "employee";
    user.avatarUrl =
        "https://api.dicebear.com/6.x/bottts-neutral/svg?radius=50&seed=" +
        user.id;
    user.password = await bcrypt.hash(user.password, 4);

    return await addItemWithId(
        EmployeesTable,
        user.email,
        removeKey("email", user)
    );
};
