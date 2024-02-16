import {IUser} from "../../../../data/models/user";

export type NullableUser = IUser | null;
export interface PasswordSectionProps {
    user: NullableUser;
    me: NullableUser;
}