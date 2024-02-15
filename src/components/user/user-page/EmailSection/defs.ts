import {IUser} from "../../../../data/models/user";

export type NullableUser = IUser | null;
export interface EmailSectionProps {
    user: NullableUser;
    me: NullableUser;
}