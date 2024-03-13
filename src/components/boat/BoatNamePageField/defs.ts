import {IUser} from "../../../data/models/user";
import {RegionType} from "../../../data/models/region";


import {Myself, UserLogged} from "../../page/definitions";

export interface IBoatNamePageFieldProps {
    name: string;
    onUpdate(name: string): void;
    author: UserLogged | null;
    me: Myself;
    id: string;
}