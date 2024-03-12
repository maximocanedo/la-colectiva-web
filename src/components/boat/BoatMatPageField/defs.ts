import {IUser} from "../../../data/models/user";
import {RegionType} from "../../../data/models/region";
import {Myself, UserLogged} from "../../../App";

export interface IBoatMatPageFieldProps {
    mat: string;
    onUpdate(mat: string): void;
    author: UserLogged | null;
    me: Myself;
    id: string;
}