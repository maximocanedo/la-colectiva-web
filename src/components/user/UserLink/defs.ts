import {IUser} from "../../../data/models/user";

export interface UserLinkProps {
    from?: string;
    data: IUser | null;
}