import {IUser, Role} from "../../../../data/models/user";

export interface RoleSelectorProps {
    user: IUser | null;
    me: IUser | null;
}
export type FieldValidationStatus = "success" | "error" | "warning" | "none" | undefined;
export type RoleOption = { name: string, value: Role };
export type RoleOptions = { name: string, value: Role }[];