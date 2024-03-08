import {IUser} from "../../../data/models/user";
import {UserLogged} from "../../../App";

export interface IUploadedBySectionProps {
    user: IUser | UserLogged | { _id: string; username: string; name: string } | string | null;
    username?: string;
}