import {IUser} from "../../../data/models/user";
import {RegionType} from "../../../data/models/region";
import {Myself, UserLogged} from "../../../App";

export interface IEnterpriseNamePageFieldProps {
    name: string;
    onUpdate(name: string): void;
    author: UserLogged | null;
    me: Myself;
    id: string;
}